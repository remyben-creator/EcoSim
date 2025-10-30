// services/uploadCounterService.js
const UploadCounter = require("../models/UploadCounter");
const { logActionFrontend } = require("../sockets/loggerSocket");
const { logBackend, logBackendError } = require("../utils/logger");

const MAX_UPLOADS_BEFORE_TRIGGER = 50;

/**
 * Increments the counter and emits socket events
 * @param {SocketIO.Server} io 
 */
async function incrementUploadCounter(io, eventRecords = []) {
  try {
    let counter = await UploadCounter.findOne();
    if (!counter) counter = await UploadCounter.create({ count: 0 });

    counter.count += 1;
    logBackend(`Upload count: ${counter.count}/${MAX_UPLOADS_BEFORE_TRIGGER}`);

    // Emit real-time frontend update
    io.emit("s3Upload", {
      message: "New simulation file uploaded to S3!",
      count: counter.count,
      records: eventRecords,
      timestamp: new Date().toISOString(),
    });

    // Trigger special event after threshold
    if (counter.count >= MAX_UPLOADS_BEFORE_TRIGGER) {
      logBackend("Triggering special event after 10 uploads!");
      logActionFrontend("Database: ", "10 GENERATIONS OF ANIMALS HAVE DIED FOR YOUR TESTING!!!")
      io.emit("batchComplete", {
        message: `${MAX_UPLOADS_BEFORE_TRIGGER} runs uploaded!`,
        timestamp: new Date().toISOString(),
      });
      counter.count = 0; // reset counter
    }

    await counter.save();
    return counter.count;

  } catch (error) {
    logBackendError("Error incrementing upload counter:", error.message);
    throw error;
  }
}

module.exports = { incrementUploadCounter, MAX_UPLOADS_BEFORE_TRIGGER };
