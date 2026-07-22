const mongoose = require("mongoose");

const datasetChunkSchema = new mongoose.Schema(
  {
    datasetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dataset",
      required: true,
      index: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },

    rows: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DatasetChunk",
  datasetChunkSchema
);