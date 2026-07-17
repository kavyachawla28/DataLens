function DuplicateAnalysis({
  dataset,
  duplicateAnalysis,
}) {
  return (
    <div className="duplicate-analysis-box">
      <h3>Duplicate Row Analysis</h3>

      {duplicateAnalysis.length > 0 ? (
        <>
          <p>
            Found {dataset.duplicateRows} duplicate row(s)
          </p>

          <div className="duplicate-list">
            {duplicateAnalysis.map((item, index) => (
              <div
                className="duplicate-card"
                key={index}
              >
                <h4>
                  Duplicate Group {index + 1}
                </h4>

                <p>
                  Appears {item.count} times
                </p>

                <div className="duplicate-row-data">
                  {dataset.columns.map(
                    (column, columnIndex) => (
                      <span key={columnIndex}>
                        <strong>{column}:</strong>{" "}
                        {item.row[column] || "-"}
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No duplicate rows found ✓</p>
      )}
    </div>
  );
}

export default DuplicateAnalysis;