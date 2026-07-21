function SummaryCards({ dataset }) {
  const totalCells = dataset.rowCount * dataset.columnCount;

  const completeness =
    totalCells === 0
      ? 0
      : (
          ((totalCells - dataset.missingValues) /
            totalCells) *
          100
        ).toFixed(1);

  const fillRate = completeness;

  const cleanliness =
    dataset.rowCount === 0
      ? 0
      : (
          ((dataset.rowCount -
            dataset.duplicateRows) /
            dataset.rowCount) *
          100
        ).toFixed(1);

  const datasetSize =
    dataset.rowCount * dataset.columnCount;

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

      <div className="card">
        <h3>Fill Rate</h3>
        <p>{fillRate}%</p>
      </div>

      <div className="card">
        <h3>Cleanliness</h3>
        <p>{cleanliness}%</p>
      </div>

      <div className="card">
        <h3>Dataset Size</h3>
        <p>{datasetSize} Cells</p>
      </div>
    </div>
  );
}

export default SummaryCards;