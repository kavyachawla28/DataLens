import React, { useState } from "react";

const DatasetComparison = ({ history }) => {
  if (history.length < 2) return null;

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const [firstIndex, setFirstIndex] = useState(0);
  const [secondIndex, setSecondIndex] = useState(1);

  const first = sortedHistory[firstIndex];
  const second = sortedHistory[secondIndex];

  if (!first || !second) return null;

  if (firstIndex === secondIndex) {
    return (
      <div className="comparison-box">
        <h2>📊 Dataset Comparison</h2>
        <p>⚠️ Please select two different datasets to compare.</p>
      </div>
    );
  }

  return (
    <div className="comparison-box">
      <h2>📊 Dataset Comparison</h2>

      <div className="compare-selectors">
        <select
          value={firstIndex}
          onChange={(e) => setFirstIndex(Number(e.target.value))}
        >
          {sortedHistory.map((item, index) => (
            <option key={item._id} value={index}>
              {item.fileName} ({new Date(item.createdAt).toLocaleDateString()})
            </option>
          ))}
        </select>

        <select
          value={secondIndex}
          onChange={(e) => setSecondIndex(Number(e.target.value))}
        >
          {sortedHistory.map((item, index) => (
            <option key={item._id} value={index}>
              {item.fileName} ({new Date(item.createdAt).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Metric</th>

              <th>
                {first.fileName}
                <br />
                <small>
                  {new Date(first.createdAt).toLocaleString()}
                </small>
              </th>

              <th>
                {second.fileName}
                <br />
                <small>
                  {new Date(second.createdAt).toLocaleString()}
                </small>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Rows</td>

              <td className={first.rows > second.rows ? "winner" : ""}>
                {first.rows}
              </td>

              <td className={second.rows > first.rows ? "winner" : ""}>
                {second.rows}
              </td>
            </tr>

            <tr>
              <td>Columns</td>
              <td>{first.columns}</td>
              <td>{second.columns}</td>
            </tr>

            <tr>
              <td>Missing Values</td>
              <td>{first.missingValues}</td>
              <td>{second.missingValues}</td>
            </tr>

            <tr>
              <td>Duplicate Rows</td>
              <td>{first.duplicateRows}</td>
              <td>{second.duplicateRows}</td>
            </tr>

            <tr>
              <td>Quality</td>

              <td className={first.qualityScore > second.qualityScore ? "winner" : ""}>
                <span className="quality-pill">
                  {first.qualityScore}%
                </span>
              </td>

              <td className={second.qualityScore > first.qualityScore ? "winner" : ""}>
                <span className="quality-pill">
                  {second.qualityScore}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="comparison-summary">
        <h3>Comparison Result</h3>

        <p>
          {first.qualityScore > second.qualityScore
            ? `🏆 ${first.fileName} has better data quality (${first.qualityScore}%).`
            : second.qualityScore > first.qualityScore
            ? `🏆 ${second.fileName} has better data quality (${second.qualityScore}%).`
            : "🤝 Both datasets currently have the same data quality score. Compare datasets with different missing values, duplicates, or row counts to see meaningful differences."}
        </p>
      </div>
    </div>
  );
};

export default DatasetComparison;