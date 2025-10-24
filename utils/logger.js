// utils/logger.js
let io;

function setSocket(socket) {
    io = socket;
}

function getTimeStamp() {
    return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function logAction(entity, message) {
    if (!io) {
        console.warn("Socket.IO not initialized yet!");
        return;
    }
    fullMessage = `[${getTimeStamp()}] (${entity}) ${message}`;
    io.emit("log", fullMessage);
}

module.exports = { logAction, setSocket };