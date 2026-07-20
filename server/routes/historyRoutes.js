const express = require("express");

const router = express.Router();

const {
  getHistory,
  saveHistory,
  deleteHistory,
  toggleFavorite,
} = require("../controllers/historyController");

// Get all history
router.get("/", getHistory);

// Save history
router.post("/", saveHistory);

// Toggle favorite
router.patch("/:id/favorite", toggleFavorite);

// Delete history
router.delete("/:id", deleteHistory);

module.exports = router;