// services/loggerServices.js

// socket setup
let io;

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
    fullMessage = `[${getTimeStamp()}] (${entity}) ${message}`;
    io.emit("log", fullMessage);
}

module.exports = { setLoggerSocketIO, logActionFrontend };