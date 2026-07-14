const express = require("express");
const multer = require("multer");

const { uploadCSV } = require("../controllers/csvController");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 2 * 1024 * 1024,
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

module.exports = router;