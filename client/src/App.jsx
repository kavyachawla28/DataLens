import DatasetComparison from "./components/DatasetComparison";
import DashboardInsights from "./components/DashboardInsights";
import DatasetHealth from "./components/DatasetHealth";
import DatasetManager from "./components/DatasetManager";
import {
  getHistory,
  saveHistory,
  deleteHistory,
  toggleFavorite,
} from "./api/historyApi";
import Recommendations from "./components/Recommendations";
import { FaTrash } from "react-icons/fa";
import { jsPDF } from "jspdf";
import Header from "./components/Header";
import UploadBox from "./components/UploadBox";
import SummaryCards from "./components/SummaryCards";
import QualityScore from "./components/QualityScore";
import SearchSortFilter from "./components/SearchSortFilter";
import DataPreview from "./components/DataPreview";
import Charts from "./components/Charts";
import DuplicateAnalysis from "./components/DuplicateAnalysis";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaDatabase,
  FaUpload,
  FaChartBar,
  FaDownload,
  FaCheckCircle,
} from "react-icons/fa";
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
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
 
  const loadHistory = async () => {
  try {
    const response = await getHistory();
    setAnalysisHistory(response.data);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  loadHistory();
}, []);

const handleDeleteHistory = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this analysis?"
  );

  if (!confirmDelete) return;

  try {
    await deleteHistory(id);
    await loadHistory();
  } catch (error) {
    console.error(error);
  }
};
const handleFavorite = async (id) => {
  try {
    await toggleFavorite(id);
    loadHistory();
  } catch (error) {
    console.error("Error updating favorite:", error);
  }
};
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

console.log("UPLOAD RESPONSE:", response.data);
console.log("DATASET:", response.data.dataset);

      setDataset(response.data.dataset);
      const totalCells =
  response.data.dataset.rowCount * response.data.dataset.columnCount;

const qualityScore = Math.round(
  ((totalCells - response.data.dataset.missingValues) / totalCells) * 100
);

await saveHistory({
  fileName: response.data.dataset.fileName,
  rows: response.data.dataset.rowCount,
  columns: response.data.dataset.columnCount,
  missingValues: response.data.dataset.missingValues,
  duplicateRows: response.data.dataset.duplicateRows,
  qualityScore,
});

await loadHistory();


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
        { data: dataset.data, columns: dataset.columns }
      );

      setDataset(response.data.dataset);
      console.log(response.data.dataset);
      
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

  const handleExportReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("DataLens Analysis Report", 20, 20);

    doc.setFontSize(12);

    doc.text(`Dataset: ${dataset.fileName}`, 20, 40);

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      20,
      50
    );

    doc.line(20, 60, 190, 60);

    doc.text(`Total Rows: ${dataset.rowCount}`, 20, 75);

    doc.text(`Total Columns: ${dataset.columnCount}`, 20, 85);

    doc.text(
      `Missing Values: ${dataset.missingValues}`,
      20,
      95
    );

    doc.text(
      `Duplicate Rows: ${dataset.duplicateRows}`,
      20,
      105
    );

    doc.text(
      `Quality Score: ${qualityScore}/100`,
      20,
      115
    );

    doc.text(
      `Quality Status: ${qualityStatus}`,
      20,
      125
    );

    doc.line(20, 140, 190, 140);

    doc.setFontSize(11);

    doc.text(
      "Generated by DataLens - Smart CSV Analytics Dashboard",
      20,
      155
    );

    doc.save("DataLens_Report.pdf");
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
const scrollToSection = (ref) => {
  ref.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
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
  const filteredData = dataset
    ? dataset.data
      .filter((row) => {
        const matchesSearch =
          dataset.columns.some((column) =>
            String(row[column] || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );

        if (!filterColumn || !filterValue) {
          return matchesSearch;
        }

        const matchesFilter =
          String(row[filterColumn] || "")
            .toLowerCase()
            .includes(filterValue.toLowerCase());

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (!sortColumn) return 0;

        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        const numA = Number(valueA);
        const numB = Number(valueB);

        let comparison = 0;

        if (!isNaN(numA) && !isNaN(numB)) {
          comparison = numA - numB;
        } else {
          comparison = String(valueA).localeCompare(String(valueB));
        }

        return sortOrder === "asc"
          ? comparison
          : -comparison;
      })
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
        <div className="hero">

          <Header />

        </div>

        <UploadBox
          file={file}
          loading={loading}
          error={error}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
        />

        {dataset && (
          <div className="results">
            <h2>Dataset Summary</h2>

            <p className="dataset-name">
              {dataset.fileName}
            </p>

           
<DatasetManager
  history={analysisHistory}
  onDelete={handleDeleteHistory}
  onFavorite={handleFavorite}
/>

<DatasetComparison
  history={analysisHistory}
/>
            <SummaryCards dataset={dataset} />
<DashboardInsights dataset={dataset} />
<DatasetHealth dataset={dataset} />
<Recommendations dataset={dataset} />
            <QualityScore
              qualityScore={qualityScore}
              qualityStatus={qualityStatus}
              cleanDataset={handleCleanDataset}
              downloading={cleaning}
              downloadCleanedCSV={handleDownloadCSV}
              exportReport={handleExportReport}
            />
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
              <SearchSortFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortColumn={sortColumn}
                setSortColumn={setSortColumn}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                filterColumn={filterColumn}
                setFilterColumn={setFilterColumn}
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                dataset={dataset}
              />
              <div className="preview-box">

                <h3>Data Preview</h3>

                <Charts
                  numericColumns={numericColumns}
                  selectedColumn={selectedColumn}
                  setSelectedColumn={setSelectedColumn}
                  chartData={chartData}
                  columnInsights={columnInsights}
                />

                <DataPreview
                  dataset={dataset}
                  filteredData={filteredData}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;