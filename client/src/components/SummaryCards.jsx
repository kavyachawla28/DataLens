function SummaryCards({ dataset }) {
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
    </div>
  );
}

export default SummaryCards;