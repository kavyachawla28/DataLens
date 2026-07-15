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
  const [error, setError] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setDataset(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:5000/api/csv/upload",
        formData
      );

      setDataset(response.data.dataset);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to upload CSV file"
      );
    } finally {
      setLoading(false);
    }
  };

const numericColumns = dataset
  ? dataset.columns.filter((column) =>
      dataset.data.some(
        (row) =>
          row[column] !== "" &&
          !isNaN(Number(row[column]))
      )
    )
  : [];
  const chartData =
  dataset && selectedColumn
    ? dataset.data.map((row, index) => ({
        name: row.Name || `Row ${index + 1}`,
        value: Number(row[selectedColumn]) || 0,
      }))
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
  Score is calculated using missing value and duplicate row percentages.
</small>
</div>        
            <div className="columns-box">
              <h3>Columns</h3>

              <div className="column-list">
                {dataset.columns.map((column, index) => (
                  <span key={index}>
                    {column}
                  </span>
                ))}
              </div>
            <div className="preview-box">
  <h3>Data Preview</h3>
{numericColumns.length > 0 && (
  <div className="chart-box">
    <h3>Visualize Numeric Data</h3>

    <select
      value={selectedColumn}
      onChange={(event) =>
        setSelectedColumn(event.target.value)
      }
    >
      <option value="">
        Select a numeric column
      </option>

      {numericColumns.map((column, index) => (
        <option key={index} value={column}>
          {column}
        </option>
      ))}
    </select>

    {selectedColumn && (
      <div className="chart-area">
        <h3>{selectedColumn} Analysis</h3>

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
  </div>
)}

  <div className="table-container">
    <table>
      <thead>
        <tr>
          {dataset.columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {dataset.data.slice(0, 5).map((row, rowIndex) => (
          <tr key={rowIndex}>
            {dataset.columns.map((column, columnIndex) => (
              <td key={columnIndex}>
                {row[column] || "-"}
              </td>
            ))}
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