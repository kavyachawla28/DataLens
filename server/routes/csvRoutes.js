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

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const upload = multer({
  dest: uploadPath,

  limits: {
    fileSize: 100 * 1024 * 1024,
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

// Protected Routes
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadCSV
);

router.post("/clean", authMiddleware, cleanDataset);

router.get("/chunk/:datasetId", authMiddleware, getDatasetChunk);

router.get("/export/:datasetId", authMiddleware, exportDataset);

module.exports = router;