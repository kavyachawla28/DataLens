function DatasetHealth({ dataset }) {
  if (!dataset) return null;

  const totalCells = dataset.rowCount * dataset.columnCount;

  const quality =
    totalCells === 0
      ? 0
      : Math.round(
          ((totalCells - dataset.missingValues) / totalCells) * 100
        );

  const color =
    quality >= 90
      ? "#22c55e"
      : quality >= 70
      ? "#f59e0b"
      : "#ef4444";

  const status =
    quality >= 90
      ? "Excellent"
      : quality >= 70
      ? "Good"
      : "Poor";

  return (
    <div className="health-box">
      <h2>Dataset Health</h2>

      <div className="health-circle">
        <svg width="180" height="180">
          <circle
            cx="90"
            cy="90"
            r="70"
            stroke="#e5e7eb"
            strokeWidth="14"
            fill="none"
          />

          <circle
            cx="90"
            cy="90"
            r="70"
            stroke={color}
            strokeWidth="14"
            fill="none"
            strokeDasharray={440}
            strokeDashoffset={440 - (440 * quality) / 100}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
          />

          <text
            x="90"
            y="98"
            textAnchor="middle"
            fontSize="28"
            fontWeight="700"
          >
            {quality}%
          </text>
        </svg>
      </div>

      <h3>{status}</h3>
    </div>
  );
}

export default DatasetHealth;