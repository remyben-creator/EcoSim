// models/UploadCounter.js
const mongoose = require("mongoose");

const uploadCounterSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model("UploadCounter", uploadCounterSchema);