const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    rows: {
      type: Number,
      required: true,
    },

    columns: {
      type: Number,
      required: true,
    },

    missingValues: {
      type: Number,
      default: 0,
    },

    duplicateRows: {
      type: Number,
      default: 0,
    },

    qualityScore: {
      type: Number,
      default: 0,
    },

    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("History", historySchema);