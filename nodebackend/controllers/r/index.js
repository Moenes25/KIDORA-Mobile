// controllers/uploadController.js

const fs = require("fs");
const path = require("path");
const Busboy = require("busboy");

exports.uploadLargeFile = (req, res) => {
  try {
    const busboy = new Busboy({ headers: req.headers });

    let filePath;
    let fileName;

    // When a file is streamed
    busboy.on("file", (fieldname, file, name, encoding, mimetype) => {
      fileName = Date.now() + "-" + name;
      filePath = path.join(__dirname, "../../uploads", fileName);
      const uploadsDir = path.join(__dirname, "../../uploads");
      console.log("Uploading:", fileName);

      // Create write stream to save file chunk-by-chunk
      const writeStream = fs.createWriteStream(filePath);

      file.pipe(writeStream);

      // Handle errors
      file.on("error", (err) => {
        console.error("File error:", err);
        res.status(500).json({ error: "Upload failed" });
      });

      writeStream.on("close", () => {
        console.log("Upload complete:", fileName);
      });
    });

    // When entire request finished
    busboy.on("finish", () => {
      res.status(200).json({
        message: "File uploaded successfully",
        file: fileName,
      });
    });

    req.pipe(busboy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
