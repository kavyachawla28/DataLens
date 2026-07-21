function OutlierAnalysis({ columnInsights }) {
  if (!columnInsights) return null;

  return (
    <div className="chart-box" style={{ marginTop: "25px" }}>
      <h3>📈 Outlier Analysis (IQR Method)</h3>

      <div className="insights-grid">
        <div className="insight-card">
          <h4>Q1</h4>
          <p>{columnInsights.q1.toFixed(2)}</p>
        </div>

        <div className="insight-card">
          <h4>Median</h4>
          <p>{columnInsights.median.toFixed(2)}</p>
        </div>

        <div className="insight-card">
          <h4>Q3</h4>
          <p>{columnInsights.q3.toFixed(2)}</p>
        </div>

        <div className="insight-card">
          <h4>IQR</h4>
          <p>{columnInsights.iqr.toFixed(2)}</p>
        </div>

        <div className="insight-card">
          <h4>Lower Bound</h4>
          <p>{columnInsights.lowerBound.toFixed(2)}</p>
        </div>

        <div className="insight-card">
          <h4>Upper Bound</h4>
          <p>{columnInsights.upperBound.toFixed(2)}</p>
        </div>

        <div className="insight-card">
          <h4>Outliers Found</h4>
          <p>{columnInsights.outlierCount}</p>
        </div>
      </div>

      {columnInsights.outlierCount > 0 ? (
        <>
          <h4 style={{ marginTop: "20px" }}>Outlier Values</h4>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            {columnInsights.outliers.map((value, index) => (
              <span
                key={index}
                style={{
                  padding: "8px 14px",
                  borderRadius: "20px",
                  background: "#fee2e2",
                  color: "#b91c1c",
                  fontWeight: 600,
                }}
              >
                {value}
              </span>
            ))}
          </div>
        </>
      ) : (
        <p
          style={{
            marginTop: "20px",
            color: "#16a34a",
            fontWeight: 600,
          }}
        >
          ✅ No outliers detected.
        </p>
      )}
    </div>
  );
}

export default OutlierAnalysis;