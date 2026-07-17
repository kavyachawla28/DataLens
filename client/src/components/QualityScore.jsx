function QualityScore({
  qualityScore,
  qualityStatus,
  cleanDataset,
  downloading,
  downloadCleanedCSV,
}) {
  return (
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

      <br />
      <br />

      {qualityScore < 100 ? (
        <button onClick={cleanDataset}>
          Clean Dataset
        </button>
      ) : (
        <p>✓ Dataset is Clean</p>
      )}

      <br />

      <button onClick={downloadCleanedCSV}>
        {downloading
          ? "Downloading..."
          : "Download Cleaned CSV"}
      </button>
    </div>
  );
}

export default QualityScore;