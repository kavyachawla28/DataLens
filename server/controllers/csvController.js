const fs = require("fs");
const csv = require("csv-parser");

const Dataset = require("../models/Dataset");
const DatasetChunk = require("../models/DatasetChunk");

const uploadCSV = async (req, res) => {
  console.log("===== uploadCSV called =====");

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a CSV file",
      });
    }

    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", async () => {
        try {
          if (results.length === 0) {
            fs.unlinkSync(req.file.path);

            return res.status(400).json({
              message: "CSV file is empty",
            });
          }

          const columns = Object.keys(results[0]);

          let missingValues = 0;

          results.forEach((row) => {
            columns.forEach((column) => {
              if (
                row[column] === undefined ||
                row[column] === null ||
                row[column].trim() === ""
              ) {
                missingValues++;
              }
            });
          });

          const uniqueRows = new Set(
            results.map((row) => JSON.stringify(row))
          );

          const duplicateRows =
            results.length - uniqueRows.size;

          const dataset = await Dataset.create({
            userId: req.user.id,
            fileName: req.file.originalname,
            columns,
            rowCount: results.length,
            columnCount: columns.length,
            missingValues,
            duplicateRows,
            data: [],
          });

          const CHUNK_SIZE = 5000;

          for (let i = 0; i < results.length; i += CHUNK_SIZE) {
            await DatasetChunk.create({
              datasetId: dataset._id,
              chunkIndex: i / CHUNK_SIZE,
              rows: results.slice(i, i + CHUNK_SIZE),
            });
          }

          dataset.data = results.slice(0, 100);
          await dataset.save();

          fs.unlinkSync(req.file.path);

          return res.status(201).json({
            message: "CSV uploaded successfully",
            dataset,
          });

        } catch (error) {
          console.error("FULL ERROR:", error);

          if (
            req.file &&
            fs.existsSync(req.file.path)
          ) {
            fs.unlinkSync(req.file.path);
          }

          return res.status(500).json({
            message: "Failed to process CSV file",
            error: error.message,
          });
        }
      })
      .on("error", (error) => {
        if (
          req.file &&
          fs.existsSync(req.file.path)
        ) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
          message: "Failed to read CSV file",
          error: error.message,
        });
      });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const cleanDataset = async (req, res) => {
  try {
    const { datasetId } = req.body;

    if (!datasetId) {
      return res.status(400).json({
        message: "Dataset ID is required",
      });
    }

    const dataset = await Dataset.findOne({
      _id: datasetId,
      userId: req.user.id,
    });

    if (!dataset) {
      return res.status(404).json({
        message: "Dataset not found",
      });
    }

    const chunks = await DatasetChunk.find({
      datasetId,
    }).sort({
      chunkIndex: 1,
    });

    let data = [];

    chunks.forEach((chunk) => {
      data.push(...chunk.rows);
    });

    const originalRows = data.length;

    const uniqueRows = Array.from(
      new Map(
        data.map((row) => [
          JSON.stringify(row),
          row,
        ])
      ).values()
    );

    const cleanedData = uniqueRows.map((row) => {
      const cleanedRow = {};

      Object.keys(row).forEach((key) => {
        cleanedRow[key] =
          row[key] === "" ||
          row[key] === null ||
          row[key] === undefined
            ? "N/A"
            : row[key];
      });

      return cleanedRow;
    });

    dataset.data = cleanedData.slice(0, 100);
    dataset.rowCount = cleanedData.length;
    dataset.columnCount = dataset.columns.length;
    dataset.duplicateRows = 0;

    let missingValues = 0;

    cleanedData.forEach((row) => {
      dataset.columns.forEach((column) => {
        if (
          row[column] === "" ||
          row[column] === null ||
          row[column] === undefined
        ) {
          missingValues++;
        }
      });
    });

    dataset.missingValues = missingValues;

    await dataset.save();

    await DatasetChunk.deleteMany({
      datasetId,
    });

    const CHUNK_SIZE = 5000;

    for (let i = 0; i < cleanedData.length; i += CHUNK_SIZE) {
      await DatasetChunk.create({
        datasetId,
        chunkIndex: i / CHUNK_SIZE,
        rows: cleanedData.slice(i, i + CHUNK_SIZE),
      });
    }

    return res.status(200).json({
      message: "Dataset cleaned successfully",
      originalRows,
      cleanedRows: cleanedData.length,
      dataset,
    });

  } catch (error) {
    console.error("Dataset cleaning failed:", error);

    return res.status(500).json({
      message: "Dataset cleaning failed",
      error: error.message,
    });
  }
};

const getDatasetChunk = async (req, res) => {
  try {
    const { datasetId } = req.params;

    const page = parseInt(req.query.page || "1");

    const dataset = await Dataset.findOne({
      _id: datasetId,
      userId: req.user.id,
    });

    if (!dataset) {
      return res.status(404).json({
        message: "Dataset not found",
      });
    }

    const chunk = await DatasetChunk.findOne({
      datasetId,
      chunkIndex: page - 1,
    });

    if (!chunk) {
      return res.status(404).json({
        message: "Chunk not found",
      });
    }

    return res.status(200).json({
      page,
      rows: chunk.rows,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to load dataset chunk",
      error: error.message,
    });
  }
};

const exportDataset = async (req, res) => {
  try {
    const { datasetId } = req.params;

    const dataset = await Dataset.findOne({
      _id: datasetId,
      userId: req.user.id,
    });

    if (!dataset) {
      return res.status(404).json({
        message: "Dataset not found",
      });
    }

    const chunks = await DatasetChunk.find({
      datasetId,
    }).sort({
      chunkIndex: 1,
    });

    if (chunks.length === 0) {
      return res.status(404).json({
        message: "No chunks found",
      });
    }

    const headers = dataset.columns;

    const csvRows = [];

    csvRows.push(headers.join(","));

    chunks.forEach((chunk) => {
      chunk.rows.forEach((row) => {
        csvRows.push(
          headers
            .map((column) => {
              const value = row[column] ?? "";
              return `"${String(value).replace(/"/g, '""')}"`;
            })
            .join(",")
        );
      });
    });

    const csvContent = csvRows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="cleaned_${dataset.fileName}"`
    );

    return res.send(csvContent);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to export dataset",
      error: error.message,
    });
  }
};

module.exports = {
  uploadCSV,
  cleanDataset,
  getDatasetChunk,
  exportDataset,
};