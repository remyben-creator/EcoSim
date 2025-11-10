// app.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const environmentRoutes = require("./routes/api/environmentRoutes");
const entityRoutes = require("./routes/api/entityRoutes");
const { setGridSocketIO } = require("./sockets/gridSocket");
const { setLoggerSocketIO } = require("./sockets/loggerSocket");
const { logBackend } = require("./utils/logger");

const app = express();
app.use(express.json());

// Create HTTP + Socket.IO, but only export for server.js
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

setGridSocketIO(io);
setLoggerSocketIO(io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/environment", environmentRoutes);
app.use("/api/entities", entityRoutes);

const s3WebhookRouter = require("./routes/webhooks/s3Webhook")(io);
app.use("/webhooks/s3", s3WebhookRouter);

io.on("connection", (socket) => {
  logBackend("Frontend connected");
  socket.on("disconnect", () => logBackend("Frontend disconnected"));
});

module.exports = { app, server };
