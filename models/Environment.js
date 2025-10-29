// models/Environment.js
const mongoose = require("mongoose");

const environmentSchema = new mongoose.Schema({
    width: Number,
    height: Number,
    isSimulationRunning: Boolean,
});

module.exports = mongoose.model("Environment", environmentSchema);