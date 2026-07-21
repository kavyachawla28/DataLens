function QualityScore({
  qualityScore,
  qualityStatus,
  cleanDataset,
  downloading,
  downloadCleanedCSV,
  exportReport,
}) {
  let badgeColor = "#ef4444";
  let badgeIcon = "🔴";

  if (qualityScore >= 90) {
    badgeColor = "#16a34a";
    badgeIcon = "🟢";
  } else if (qualityScore >= 75) {
    badgeColor = "#eab308";
    badgeIcon = "🟡";
  } else if (qualityScore >= 50) {
    badgeColor = "#f97316";
    badgeIcon = "🟠";
  }

  return (
    <div className="quality-box">
      <h3>Data Quality Score</h3>

      <div className="score">
        {qualityScore}
        <span>/100</span>
      </div>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width: `${qualityScore}%`,
            backgroundColor: badgeColor,
          }}
        ></div>
      </div>

      <div
        className="quality-badge"
        style={{ background: badgeColor }}
      >
        {badgeIcon} {qualityStatus}
      </div>

      <small>
        Score is calculated using missing value and duplicate row percentages.
      </small>

      <br />
      <br />

      {qualityScore < 100 ? (
        <button onClick={cleanDataset}>
          🧹 Clean Dataset
        </button>
      ) : (
        <p className="clean-message">
          ✅ Dataset is already clean
        </p>
      )}

      <br />

      <button onClick={downloadCleanedCSV}>
        {downloading
          ? "Downloading..."
          : "⬇ Download Cleaned CSV"}
      </button>

      <br />

      <button
        className="report-btn"
        onClick={exportReport}
      >
        📄 Export Analysis Report
      </button>
    </div>
  );
}

export default QualityScore;