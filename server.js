// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const http = require("http")
const { Server } = require("socket.io")
const { initEcosystem, resetDatabase, runTick } = require("./controllers/ecosystemController")
const { setGridSocketIO, sendGridUpdate } = require("./services/gridService");
const { setLoggerSocketIO } = require("./services/loggerService");

dotenv.config()
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Basic test route
app.get("/", (req,res) => {
    res.send("EcoSim API is running!");
});

// create HTTP server for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // allow frontend connections
});

// give logger access to Socket.io
setGridSocketIO(io);
setLoggerSocketIO(io);

// store current grid size globally and simulation state
let currentGridSize = 5;
let isSimulationRunning = false;
let simulationInterval = null;

io.on("connection", (socket) => {
    console.log("Frontend connected for logs");

    // send initial state when frontend connects
    sendGridUpdate(currentGridSize);

    // Handle ecosystem reset requests
    socket.on("resetEcosystem", async ({ plantsNum, rabbitsNum, foxesNum, gridSize }) => {
        try {
            console.log(`Resetting ecosystem: ${plantsNum} plants, ${rabbitsNum} rabbits, ${foxesNum} foxes, ${gridSize}x${gridSize} grid`);
            
            // Stop any running simulation first
            if (simulationInterval) {
                clearInterval(simulationInterval);
                simulationInterval = null;
                isSimulationRunning = false;
            }

            // update global grid size
            currentGridSize = gridSize;

            await resetDatabase();
            await initEcosystem(plantsNum, rabbitsNum, foxesNum, gridSize);
            await sendGridUpdate(gridSize);
            
            socket.emit("log", "Ecosystem reset successfully!");
        } catch (error) {
            console.error("Error resetting ecosystem:", error);
            socket.emit("log", "Error resetting ecosystem!");
        }
    });

        // Handle start simulation requests
    socket.on("startSimulation", async () => {
        try {
            if (isSimulationRunning) {
                socket.emit("log", "Simulation is already running!");
                return;
            }

            // Start the simulation loop
            isSimulationRunning = true;
            simulationInterval = setInterval(async () => {
                await runTick();
                await sendGridUpdate(currentGridSize);
            }, 5000);
            
            socket.emit("log", "Simulation started!");
        } catch (error) {
            console.error("Error starting simulation:", error);
            socket.emit("log", "Error starting simulation!");
        }
    });

    // Handle pause simulation requests
    socket.on("pauseSimulation", () => {
        if (simulationInterval && isSimulationRunning) {
            clearInterval(simulationInterval);
            simulationInterval = null;
            isSimulationRunning = false;
            socket.emit("log", "Simulation paused!");
        } else {
            socket.emit("log", "No simulation is currently running!");
        }
    });
});

connectDB().then(async () => {
    console.log("Database connected successfully");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
