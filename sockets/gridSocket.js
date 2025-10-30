// services/socketService.js
const Plant = require("../models/Plant");
const Animal = require("../models/Animal");
const { logBackend, logBackendError } = require("../utils/logger");

// socket setup
let io;

function setGridSocketIO(socketInstance) {
    io = socketInstance;
}

// Function to send current ecosystem state to frontend
async function sendGridUpdate(gridSize) {
    try {
        const plants = await Plant.find({});
        const animals = await Animal.find({ alive: true });
        
        io.emit("gridUpdate", { plants, animals, gridSize });
        logBackend("Grid update sent to frontend");
    } catch (error) {
        logBackendError("Error sending grid update:", error);
    }
}

module.exports = { setGridSocketIO, sendGridUpdate };