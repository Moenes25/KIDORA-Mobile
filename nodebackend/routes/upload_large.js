// routes/upload.js

const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/r/index");

router.post("/upload", uploadController.uploadLargeFile);

module.exports = router;
