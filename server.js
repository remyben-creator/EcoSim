// server.js
const dotenv = require("dotenv");
const connectDB = require("./config/mongooseDb");
const { app, server } = require("./app");
const { logBackend } = require("./utils/logger");

dotenv.config();

connectDB().then(() => logBackend("Database connected successfully"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logBackend(`Server running on port ${PORT}`));
