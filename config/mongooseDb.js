// config/db.js
const mongoose = require('mongoose');
const { logBackend, logBackendError } = require("../utils/logger");

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        logBackend(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logBackendError(`MongoDB Connection Error: `, error.message);
        process.exit(1);
    }
}

module.exports = connectDB;