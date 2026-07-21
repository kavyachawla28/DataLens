function DistributionStatistics({ columnInsights }) {
  if (!columnInsights) return null;

  return (
    <div className="chart-box" style={{ marginTop: "25px" }}>
      <h3>📊 Distribution Statistics</h3>

      <div className="insights-grid">
        <div className="insight-card">
          <h4>Mean</h4>
          <p>{columnInsights.average.toFixed(2)}</p>
        </div>

        <div className="insight-card">
          <h4>Median</h4>
          <p>{columnInsights.median.toFixed(2)}</p>
        </div>

        <div className="insight-card">
          <h4>Mode</h4>
          <p>{columnInsights.mode}</p>
        </div>

        <div className="insight-card">
          <h4>Range</h4>
          <p>{columnInsights.range.toFixed(2)}</p>
        </div>

        <div className="insight-card">
          <h4>Variance</h4>
          <p>{columnInsights.variance.toFixed(2)}</p>
        </div>

        <div className="insight-card">
          <h4>Std. Deviation</h4>
          <p>{columnInsights.standardDeviation.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default DistributionStatistics;