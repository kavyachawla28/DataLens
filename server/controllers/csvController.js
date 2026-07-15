const fs = require("fs");
const csv = require("csv-parser");

const Dataset = require("../models/Dataset");

const uploadCSV = async (req, res) => {
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
            fileName: req.file.originalname,
            columns,
            rowCount: results.length,
            columnCount: columns.length,
            missingValues,
            duplicateRows,
            data: results,
          });

          fs.unlinkSync(req.file.path);

          res.status(201).json({
            message: "CSV uploaded successfully",
            dataset,
          });
        } catch (error) {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }

          res.status(500).json({
            message: "Failed to process CSV file",
            error: error.message,
          });
        }
      })
      .on("error", (error) => {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
          message: "Failed to read CSV file",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const cleanDataset = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        message: "Invalid dataset",
      });
    }

    // Remove duplicate rows
    const uniqueRows = Array.from(
      new Map(
        data.map((row) => [
          JSON.stringify(row),
          row,
        ])
      ).values()
    );

    // Fill missing values
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

    res.status(200).json({
      message: "Dataset cleaned successfully",
      originalRows: data.length,
      cleanedRows: cleanedData.length,
      data: cleanedData,
    });
  } catch (error) {
    console.error("Dataset cleaning failed:", error);

    res.status(500).json({
      message: "Dataset cleaning failed",
    });
  }
};

module.exports = {
  uploadCSV,
  cleanDataset,
};