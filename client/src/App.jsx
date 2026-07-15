import { useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setDataset(null);
    setSelectedColumn("");
    setError("");
    setSuccessMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const formData = new FormData();

      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:5000/api/csv/upload",
        formData
      );

      setDataset(response.data.dataset);
      setSelectedColumn("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to upload CSV file"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCleanDataset = async () => {
    if (!dataset) {
      return;
    }

    try {
      setCleaning(true);
      setError("");
      setSuccessMessage("");

      const response = await axios.post(
        "http://localhost:5000/api/csv/clean",
        {
          data: dataset.data,
        }
      );

      const cleanedData = response.data.data;

      const columns =
        cleanedData.length > 0
          ? Object.keys(cleanedData[0])
          : dataset.columns;

      setDataset((previousDataset) => ({
        ...previousDataset,
        data: cleanedData,
        columns,
        rowCount: cleanedData.length,
        columnCount: columns.length,
        missingValues: 0,
        duplicateRows: 0,
      }));

      setSelectedColumn("");

      setSuccessMessage(
        `Dataset cleaned successfully. ${response.data.originalRows} rows reduced to ${response.data.cleanedRows} rows.`
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to clean dataset"
      );
    } finally {
      setCleaning(false);
    }
  };

  const handleDownloadCSV = () => {
  if (!dataset || dataset.data.length === 0) {
    setError("No dataset available to download");
    return;
  }

  const headers = dataset.columns;

  const csvRows = [
    headers.join(","),
    ...dataset.data.map((row) =>
      headers
        .map((column) => {
          const value = row[column] ?? "";

          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ];

  const csvContent = csvRows.join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `cleaned_${dataset.fileName}`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

  const numericColumns = dataset
    ? dataset.columns.filter((column) =>
        dataset.data.some(
          (row) =>
            row[column] !== "" &&
            row[column] !== "N/A" &&
            !isNaN(Number(row[column]))
        )
      )
    : [];

  const chartData =
    dataset && selectedColumn
      ? dataset.data.map((row, index) => ({
          name: row.Name || `Row ${index + 1}`,
          value:
            row[selectedColumn] === "N/A"
              ? 0
              : Number(row[selectedColumn]) || 0,
        }))
      : [];
const columnInsights =
  dataset && selectedColumn
    ? (() => {
        const values = dataset.data
          .map((row) => Number(row[selectedColumn]))
          .filter((value) => !isNaN(value));

        if (values.length === 0) {
          return null;
        }

        const sum = values.reduce(
          (total, value) => total + value,
          0
        );

        return {
          average: sum / values.length,
          minimum: Math.min(...values),
          maximum: Math.max(...values),
          sum,
        };
      })()
    : null;
const columnTypes = dataset
  ? dataset.columns.map((column) => {
      const values = dataset.data
        .map((row) => row[column])
        .filter(
          (value) =>
            value !== "" &&
            value !== null &&
            value !== undefined &&
            value !== "N/A"
        );

      const isNumeric =
        values.length > 0 &&
        values.every(
          (value) => !isNaN(Number(value))
        );

      return {
        name: column,
        type: isNumeric ? "Numeric" : "Text",
      };
    })
  : [];
  const missingValueAnalysis = dataset
  ? dataset.columns.map((column) => {
      const missingCount = dataset.data.filter(
        (row) =>
          row[column] === "" ||
          row[column] === null ||
          row[column] === undefined
      ).length;

      const missingPercentage =
        dataset.rowCount > 0
          ? (missingCount / dataset.rowCount) * 100
          : 0;

      return {
        column,
        missingCount,
        missingPercentage,
      };
    })
  : [];
  const duplicateAnalysis = dataset
  ? (() => {
      const rowCountMap = new Map();

      dataset.data.forEach((row) => {
        const rowKey = JSON.stringify(row);

        rowCountMap.set(
          rowKey,
          (rowCountMap.get(rowKey) || 0) + 1
        );
      });

      const duplicateRows = [];

      rowCountMap.forEach((count, rowKey) => {
        if (count > 1) {
          duplicateRows.push({
            row: JSON.parse(rowKey),
            count,
          });
        }
      });

      return duplicateRows;
    })()
  : [];
const categoricalColumns = columnTypes
  .filter((column) => column.type === "Text")
  .map((column) => column.name);

const categoricalData =
  dataset && selectedCategory
    ? (() => {
        const valueCounts = {};

        dataset.data.forEach((row) => {
          const value =
            row[selectedCategory] === "" ||
            row[selectedCategory] === null ||
            row[selectedCategory] === undefined
              ? "Missing"
              : row[selectedCategory];

          valueCounts[value] =
            (valueCounts[value] || 0) + 1;
        });

        return Object.entries(valueCounts).map(
          ([name, value]) => ({
            name,
            value,
          })
        );
      })()
    : [];
  const totalCells = dataset
    ? dataset.rowCount * dataset.columnCount
    : 0;

  const missingPercentage =
    totalCells > 0
      ? (dataset.missingValues / totalCells) * 100
      : 0;

  const duplicatePercentage =
    dataset && dataset.rowCount > 0
      ? (dataset.duplicateRows / dataset.rowCount) * 100
      : 0;

  const qualityScore = dataset
    ? Math.max(
        0,
        Math.round(
          100 -
            missingPercentage -
            duplicatePercentage
        )
      )
    : 0;

  const qualityStatus =
    qualityScore >= 80
      ? "Good Quality"
      : qualityScore >= 50
      ? "Needs Cleaning"
      : "Poor Quality";

  return (
    <div className="app">
      <div className="container">
        <h1>DataLens</h1>

        <p className="subtitle">
          Smart CSV Analytics Dashboard
        </p>

        <div className="upload-box">
          <h2>Upload your CSV file</h2>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />

          {file && (
            <p className="file-name">
              Selected file: {file.name}
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze CSV"}
          </button>

          {error && (
            <p className="error-message">{error}</p>
          )}

          {successMessage && (
            <p className="success-message">
              {successMessage}
            </p>
          )}
        </div>

        {dataset && (
          <div className="results">
            <h2>Dataset Summary</h2>

            <p className="dataset-name">
              {dataset.fileName}
            </p>

            <div className="cards">
              <div className="card">
                <h3>Total Rows</h3>
                <p>{dataset.rowCount}</p>
              </div>

              <div className="card">
                <h3>Total Columns</h3>
                <p>{dataset.columnCount}</p>
              </div>

              <div className="card">
                <h3>Missing Values</h3>
                <p>{dataset.missingValues}</p>
              </div>

              <div className="card">
                <h3>Duplicate Rows</h3>
                <p>{dataset.duplicateRows}</p>
              </div>
            </div>

            <div className="quality-box">
              <h3>Data Quality Score</h3>

              <div className="score">
                {qualityScore}
                <span>/100</span>
              </div>

              <p>{qualityStatus}</p>

              <small>
                Score is calculated using missing value and
                duplicate row percentages.
              </small>

              <div className="clean-action">
  {dataset.missingValues > 0 ||
  dataset.duplicateRows > 0 ? (
    <button
      onClick={handleCleanDataset}
      disabled={cleaning}
    >
      {cleaning
        ? "Cleaning Dataset..."
        : "Clean Dataset"}
    </button>
  ) : (
    <>
      <p className="clean-status">
        ✓ Dataset is Clean
      </p>

      <button onClick={handleDownloadCSV}>
        Download Cleaned CSV
      </button>
    </>
  )}
</div>
            </div>

            <div className="columns-box">
  <h3>Column Profiling</h3>

  <div className="column-profile-grid">
    {columnTypes.map((column, index) => (
      <div
        className="column-profile-card"
        key={index}
      >
        <h4>{column.name}</h4>

        <p>{column.type}</p>
      </div>
    ))}
  </div>
  <div className="missing-analysis-box">
  <h3>Missing Value Analysis</h3>

  <div className="missing-analysis-grid">
    {missingValueAnalysis.map((item, index) => (
      <div
        className="missing-analysis-card"
        key={index}
      >
        <h4>{item.column}</h4>

        <p>
          {item.missingCount} Missing
        </p>

        <span>
          {item.missingPercentage.toFixed(2)}%
        </span>
      </div>
    ))}
  </div>
</div>
<div className="categorical-box">
  <h3>Categorical Data Analysis</h3>

  <select
    value={selectedCategory}
    onChange={(event) =>
      setSelectedCategory(event.target.value)
    }
  >
    <option value="">
      Select a text column
    </option>

    {categoricalColumns.map((column, index) => (
      <option key={index} value={column}>
        {column}
      </option>
    ))}
  </select>

  {selectedCategory && (
    <div className="category-results">
      <h4>{selectedCategory} Distribution</h4>

      {categoricalData.map((item, index) => (
        <div
          className="category-row"
          key={index}
        >
          <span>{item.name}</span>

          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  )}
</div>
              <div className="preview-box">
                <div className="duplicate-analysis-box">
  <h3>Duplicate Row Analysis</h3>

  {duplicateAnalysis.length > 0 ? (
    <>
      <p>
        Found {dataset.duplicateRows} duplicate row(s)
      </p>

      <div className="duplicate-list">
        {duplicateAnalysis.map((item, index) => (
          <div
            className="duplicate-card"
            key={index}
          >
            <h4>
              Duplicate Group {index + 1}
            </h4>

            <p>
              Appears {item.count} times
            </p>

            <div className="duplicate-row-data">
              {dataset.columns.map(
                (column, columnIndex) => (
                  <span key={columnIndex}>
                    <strong>{column}:</strong>{" "}
                    {item.row[column] || "-"}
                  </span>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  ) : (
    <p>No duplicate rows found ✓</p>
  )}
</div>
                <h3>Data Preview</h3>

                {numericColumns.length > 0 && (
                  <div className="chart-box">
                    <h3>Visualize Numeric Data</h3>

                    <select
                      value={selectedColumn}
                      onChange={(event) =>
                        setSelectedColumn(
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        Select a numeric column
                      </option>

                      {numericColumns.map(
                        (column, index) => (
                          <option
                            key={index}
                            value={column}
                          >
                            {column}
                          </option>
                        )
                      )}
                    </select>

                    {selectedColumn && (
  <div className="chart-area">
    <h3>{selectedColumn} Analysis</h3>

    {columnInsights && (
      <div className="insights-grid">
        <div className="insight-card">
          <h4>Average</h4>
          <p>{columnInsights.average.toFixed(2)}</p>
        </div>

        <div className="insight-card">
          <h4>Minimum</h4>
          <p>{columnInsights.minimum}</p>
        </div>

        <div className="insight-card">
          <h4>Maximum</h4>
          <p>{columnInsights.maximum}</p>
        </div>

        <div className="insight-card">
          <h4>Sum</h4>
          <p>{columnInsights.sum}</p>
        </div>
      </div>
    )}

    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Bar dataKey="value" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  </div>
)}

    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Bar dataKey="value" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  </div>
)}

                      
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        {dataset.columns.map(
                          (column, index) => (
                            <th key={index}>
                              {column}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {dataset.data
                        .slice(0, 5)
                        .map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {dataset.columns.map(
                              (column, columnIndex) => (
                                <td key={columnIndex}>
                                  {row[column] === "" ||
                                  row[column] === null ||
                                  row[column] === undefined
                                    ? "-"
                                    : row[column]}
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;