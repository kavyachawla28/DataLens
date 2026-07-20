const History = require("../models/History");

// Get all history
const getHistory = async (req, res) => {
  try {
    const history = await History.find().sort({
      createdAt: -1,
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Save history
const saveHistory = async (req, res) => {
  try {
    // Debug: Check what frontend is sending
    console.log("========== SAVE HISTORY ==========");
    console.log(req.body);
    console.log("==================================");

    const history = await History.create(req.body);

    res.status(201).json(history);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete history
const deleteHistory = async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);

    res.json({
      message: "History deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Toggle Favorite
const toggleFavorite = async (req, res) => {
  try {
    const history = await History.findById(req.params.id);

    if (!history) {
      return res.status(404).json({
        message: "History not found",
      });
    }

    history.favorite = !history.favorite;

    await history.save();

    res.json({
      message: "Favorite updated successfully",
      history,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getHistory,
  saveHistory,
  deleteHistory,
  toggleFavorite,
};