// services/loggerServices.js
const fs = require("fs");
const path = require("path");

// socket setup
let io;

// txt file setup
const logsDir = path.join(__dirname, "../logs");
fs.mkdirSync(logsDir, { recursive: true });
const frontendLogPath = path.join(logsDir, "frontend.log");

function setLoggerSocketIO(socketInstance) {
    io = socketInstance;
}

function getTimeStamp() {
    return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function logActionFrontend(entity, message) {
    if (!io) {
        console.warn("Socket.IO not initialized yet!");
        return;
    }
    fullMessage = `[${getTimeStamp()}] ${entity} ${message}`;
    io.emit("log", fullMessage);
    fs.appendFileSync(frontendLogPath, fullMessage + "\n");
}

module.exports = { setLoggerSocketIO, logActionFrontend, frontendLogPath };