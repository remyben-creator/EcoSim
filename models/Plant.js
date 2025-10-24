// models/Plant.js
const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
    species: { type: String, default: "grass" },
    nutrients: { type: Number, default: 5 },
    position: {
        x: Number,
        y: Number,
    },
}, { timestamps: true });

plantSchema.methods.regrow = function(amount = 1) {
    this.nutrients += amount;
    return this.save();
};

plantSchema.index({ "position.x": 1, "position.y": 1});

module.exports = mongoose.model("Plant", plantSchema);