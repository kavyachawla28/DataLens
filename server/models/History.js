const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    datasetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dataset",
      required: true,
    },

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

    data: {
      type: Array,
      default: [],
    },

    datasetColumns: {
      type: Array,
      default: [],
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