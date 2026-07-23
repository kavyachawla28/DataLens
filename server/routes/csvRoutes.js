const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  uploadCSV,
  cleanDataset,
  getDatasetChunk,
  exportDataset,
} = require("../controllers/csvController");

const router = express.Router();

const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const upload = multer({
  dest: uploadPath,

  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "text/csv" ||
      file.originalname.toLowerCase().endsWith(".csv")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

router.post("/upload", upload.single("file"), uploadCSV);

router.post("/clean", cleanDataset);

router.get("/chunk/:datasetId", getDatasetChunk);

router.get("/export/:datasetId", exportDataset);

module.exports = router;