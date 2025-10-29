// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const http = require("http")
const { Server } = require("socket.io");
const { setGridSocketIO } = require("./sockets/gridSocket");
const { setLoggerSocketIO } = require("./sockets/loggerSocket");
const environmentRoutes = require("./routes/environmentRoutes");
const entityRoutes = require("./routes/entityRoutes");

dotenv.config();
const app = express();
app.use(express.json());

// create http server first
const server = http.createServer(app);

// init socket.IO
const io = new Server(server, {
    cors: { origin: "*" } // allow frontend connections
});

// give sockets access to Socket.io
setGridSocketIO(io);
setLoggerSocketIO(io);

// attach io to req for all routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// mount API routes
app.use("/api/environment", environmentRoutes);
app.use("/api/entities", entityRoutes);

io.on("connection", (socket) => {
    console.log("Frontend connected");

    socket.on("disconnect", () => {
        console.log("Frontend disconnected");
    });
});

connectDB().then(async () => {
    console.log("Database connected successfully");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));