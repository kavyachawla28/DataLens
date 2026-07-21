function TopBottomAnalysis({ selectedColumn, dataset }) {
  if (!dataset || !selectedColumn) return null;

  const values = dataset.data
    .map((row) => Number(row[selectedColumn]))
    .filter((value) => !isNaN(value))
    .sort((a, b) => a - b);

  if (values.length === 0) return null;

  const topFive = [...values].slice(-5).reverse();
  const bottomFive = values.slice(0, 5);

  return (
    <div className="chart-box" style={{ marginTop: "25px" }}>
      <h3>📊 Top / Bottom Analysis</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div className="insight-card">
          <h4>🔺 Top 5 Highest</h4>

          <ol>
            {topFive.map((value, index) => (
              <li key={index}>{value.toLocaleString()}</li>
            ))}
          </ol>
        </div>

        <div className="insight-card">
          <h4>🔻 Top 5 Lowest</h4>

          <ol>
            {bottomFive.map((value, index) => (
              <li key={index}>{value.toLocaleString()}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default TopBottomAnalysis;