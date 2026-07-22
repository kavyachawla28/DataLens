function DataPreview({
  dataset,
  filteredData,
  currentPage,
  rowsPerPage,
}) {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const paginatedData = filteredData.slice(startIndex, endIndex);

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
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr key={startIndex + rowIndex}>
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