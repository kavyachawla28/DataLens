const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getHistory,
  saveHistory,
  deleteHistory,
  toggleFavorite,
} = require("../controllers/historyController");

// Get logged-in user's history
router.get("/", authMiddleware, getHistory);

// Save history
router.post("/", authMiddleware, saveHistory);

// Toggle favorite
router.patch("/:id/favorite", authMiddleware, toggleFavorite);

// Delete history
router.delete("/:id", authMiddleware, deleteHistory);

module.exports = router;