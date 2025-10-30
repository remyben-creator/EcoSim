// routes/webhooks/s3Webhook.js
const express = require("express");
const { logBackend, logBackendError } = require("../../utils/logger");
const { incrementUploadCounter } = require("../../services/uploadCounterService");

module.exports = (io) => {
  const router = express.Router();

  /**
   * POST /webhooks/s3
   * Handles S3/MinIO event notifications
   */
  router.post("/", async (req, res) => {
    try {
      logBackend("Received MinIO event:", req.body);

      const eventRecords = req.body.Records || [];
      eventRecords.forEach((record) => {
        const bucket = record.s3.bucket.name;
        const objectKey = record.s3.object.key;
        logBackend(`Bucket: ${bucket} | Object: ${objectKey}`);
      });

      // Increment counter and emit socket events
      await incrementUploadCounter(io, eventRecords);

      res.status(200).json({
        status: "ok",
        received: eventRecords.length,
      });
    } catch (error) {
      logBackendError("Error handling S3 webhook:", error.message);
      res.status(500).json({ error: "Failed to process event" });
    }
  });

  return router;
};
