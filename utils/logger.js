// utils/logger.js
const fs = require("fs");
const path = require("path");

// txt file setup
const logsDir = path.join(__dirname, "../logs");
fs.mkdirSync(logsDir, { recursive: true });
const backendLogPath = path.join(logsDir, "backend.log");

function getTimeStamp() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function logBackend(message) {
  const fullMessage = `[${getTimeStamp()}] ${message}`;
  console.log(fullMessage);
  fs.appendFileSync(backendLogPath, fullMessage + "\n");
}

function logBackendError(message, error) {
  const fullMessage = `[${getTimeStamp()}] ${message}`;
  console.error(fullMessage, error);
  fs.appendFileSync(backendLogPath, fullMessage + error + "\n");
}

module.exports = { logBackend, logBackendError, backendLogPath };