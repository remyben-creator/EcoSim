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

io.on("connection", (socket) => {
    console.log("Frontend connected for logs");
})

connectDB().then(async () => {
    await resetDatabase();
    await initEcosystem();
    await runTick();
    await sendGridUpdate(); // initial state

    // run ticks periodically
    setInterval(async () => {
        await runTick();
        await sendGridUpdate(); // send after each tick
    }, 5000);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
