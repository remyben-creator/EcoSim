// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/mongooseDb");
const http = require("http")
const { Server } = require("socket.io");
const { setGridSocketIO } = require("./sockets/gridSocket");
const { setLoggerSocketIO } = require("./sockets/loggerSocket");
const environmentRoutes = require("./routes/api/environmentRoutes");
const entityRoutes = require("./routes/api/entityRoutes");
const { logBackend } = require("./utils/logger");

dotenv.config();
const app = express();
app.use(express.json());

// create http server first
const server = http.createServer(app);

// init socket.IO
const io = new Server(server, {
    cors: { origin: "*" } // allow frontend connections
});

// give sockets access to Socket.io
setGridSocketIO(io);
setLoggerSocketIO(io);

// attach io to req for all routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// mount API routes
app.use("/api/environment", environmentRoutes);
app.use("/api/entities", entityRoutes);
// mount webhook routes
const s3WebhookRouter = require("./routes/webhooks/s3Webhook")(io);
app.use("/webhooks/s3", s3WebhookRouter);

io.on("connection", (socket) => {
    logBackend("Frontend connected");

    socket.on("disconnect", () => {
        logBackend("Frontend disconnected");
    });
});

connectDB().then(async () => {
    logBackend("Database connected successfully");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logBackend(`Server running on port ${PORT}`));