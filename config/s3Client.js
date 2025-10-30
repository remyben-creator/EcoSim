// config/s3Client.js
require('dotenv').config();
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  s3ForcePathStyle: true,  // Required for MinIO
  signatureVersion: 'v4',
});

module.exports = s3;
