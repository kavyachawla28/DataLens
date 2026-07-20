function DashboardInsights({ dataset }) {
  if (!dataset) return null;

  const totalCells = dataset.rowCount * dataset.columnCount;

  const quality =
    totalCells === 0
      ? 0
      : Math.round(
          ((totalCells - dataset.missingValues) / totalCells) * 100
        );

  return (
    <div className="insights-box">
      <h2>📊 Dashboard Insights</h2>

      <div className="insights-list">

        <div className="insight">
          {dataset.missingValues > 0
            ? `⚠️ ${dataset.missingValues} missing values detected`
            : "✅ No missing values found"}
        </div>

        <div className="insight">
          {dataset.duplicateRows > 0
            ? `📄 ${dataset.duplicateRows} duplicate rows found`
            : "✅ No duplicate rows"}
        </div>

        <div className="insight">
          {quality >= 90
            ? `🟢 Data quality is Excellent (${quality}%)`
            : quality >= 70
            ? `🟡 Data quality is Good (${quality}%)`
            : `🔴 Data quality needs improvement (${quality}%)`}
        </div>

        <div className="insight">
          📈 Dataset contains {dataset.columnCount} columns
        </div>

      </div>
    </div>
  );
}

export default DashboardInsights;