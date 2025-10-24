// models/Animal.js
const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
    name: String,
    species: { type: String, enum: ["rabbit", "fox"] },
    energy: { type: Number, default: 10 },
    position: {
        x: Number,
        y: Number,
    },
    alive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Animal", animalSchema);
