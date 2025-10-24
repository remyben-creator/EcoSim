// services/socketService.js
const Plant = require("../models/Plant");
const Animal = require("../models/Animal");

// socket setup
let io;

function setGridSocketIO(socketInstance) {
    io = socketInstance;
}

// Function to send current ecosystem state to frontend
async function sendGridUpdate() {
    try {
        const plants = await Plant.find({});
        const animals = await Animal.find({ alive: true });
        
        io.emit("gridUpdate", { plants, animals });
        console.log("Grid update sent to frontend");
    } catch (error) {
        console.error("Error sending grid update:", error);
    }
}

module.exports = { setGridSocketIO, sendGridUpdate };