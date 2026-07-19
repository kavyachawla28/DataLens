function SummaryCards({ dataset }) {
  const completeness =
    dataset.rowCount * dataset.columnCount === 0
      ? 0
      : (
          ((dataset.rowCount * dataset.columnCount -
            dataset.missingValues) /
            (dataset.rowCount * dataset.columnCount)) *
          100
        ).toFixed(1);

  return (
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

      <div className="card">
        <h3>Completeness</h3>
        <p>{completeness}%</p>
      </div>
    </div>
  );
}

export default SummaryCards;