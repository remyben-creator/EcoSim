// models/Environment.js
const mongoose = require("mongoose");

const environmentSchema = new mongoose.Schema({
    width: Number,
    height: Number,
    nutrients: [{
        x: Number,
        y: Number,
        amount: { type: Number, defualt: 0 },
    }]
});

module.exports = mongoose.model("Environment", environmentSchema);