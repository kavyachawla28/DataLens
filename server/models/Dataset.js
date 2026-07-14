const mongoose = require("mongoose");

const datasetSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    columns: {
      type: [String],
      required: true,
    },

    rowCount: {
      type: Number,
      required: true,
    },

    columnCount: {
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

    data: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Dataset = mongoose.model("Dataset", datasetSchema);

module.exports = Dataset;