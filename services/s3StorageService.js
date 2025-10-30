// services/s3StorageService
const fs = require('fs');
const s3 = require('../config/s3Client');
require('dotenv').config();
const { logBackend, logBackendError } = require("../utils/logger");

async function ensureBucketExists() {
  const bucketName = process.env.S3_BUCKET;

  try {
    const buckets = await s3.listBuckets().promise();
    const exists = buckets.Buckets.some(b => b.Name === bucketName);

    if (!exists) {
      await s3.createBucket({ Bucket: bucketName }).promise();
      logBackend(`✅ Created bucket: ${bucketName}`);
    }
  } catch (error) {
    logBackendError('Error checking/creating bucket:', error);
  }
}

// Uploads arbitraty JSON or text data to s3 under a given key
async function uploadFile(runId, filename, data, isJson = true) {
    const body = isJson ? JSON.stringify(data, null, 2) : data;
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `runs/${runId}/${filename}`,
        Body: body,
        ContentType: isJson ? 'application/json' : 'text/plain',
    };

    try {
        await s3.putObject(params).promise();
        logBackend(`Uploaded ${filename} for run ${runId}`);
    } catch (error) {
        logBackend(`Upload failed for ${filename}:`, error);
    }
}

// saves mongoDB data and log files from disk to S3
async function archiveRunData(runId, { backendLogPath, frontendLogPath, plants, animals, environment }) {
    await ensureBucketExists();

    // upload backend log (text file)
    if (backendLogPath && fs.existsSync(backendLogPath)) {
        const backendLog = fs.readFileSync(backendLogPath, 'utf-8');
        await uploadFile(runId, 'backend.log', backendLog, false);
        fs.writeFileSync(backendLogPath, "");
    }

    // upload frontend log (text file)
    if (frontendLogPath && fs.existsSync(frontendLogPath)) {
        const frontendLog = fs.readFileSync(frontendLogPath, 'utf-8');
        await uploadFile(runId, 'frontend.log', frontendLog, false);
        fs.writeFileSync(frontendLogPath, "");
    }

    // upload mongoose collections (JSON Data)
    if (plants) await uploadFile(runId, 'plants.json', plants);
    if (animals) await uploadFile(runId, 'animals.json', animals);
    if (environment) await uploadFile(runId, 'environment.json', environment);
}

module.exports = { ensureBucketExists, uploadFile, archiveRunData };