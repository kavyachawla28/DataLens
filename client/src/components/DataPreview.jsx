function DataPreview({
  dataset,
  filteredData,
}) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {dataset.columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {dataset.columns.map((column) => (
                  <td key={column}>
                    {row[column] || "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={dataset.columns.length}
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataPreview;