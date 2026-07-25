const History = require("../models/History");

// Get logged-in user's history
const getHistory = async (req, res) => {
  try {
    const history = await History.find({
      userId: req.user.id,
    }).sort({
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
    console.log("========== SAVE HISTORY ==========");
    console.log(req.body);
    console.log("==================================");

    const history = await History.create({
      ...req.body,
      userId: req.user.id,
    });

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
    const history = await History.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!history) {
      return res.status(404).json({
        message: "History not found",
      });
    }

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
    const history = await History.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

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