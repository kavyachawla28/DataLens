function ColumnStatistics({ dataset }) {
  if (!dataset) return null;

  const statistics = dataset.columns.map((column) => {
    const values = dataset.data.map((row) => row[column]);

    const missing = values.filter(
      (value) =>
        value === "" ||
        value === null ||
        value === undefined
    ).length;

    const unique = new Set(
      values.filter(
        (value) =>
          value !== "" &&
          value !== null &&
          value !== undefined
      )
    ).size;

    const numeric =
      values.filter(
        (value) =>
          value !== "" &&
          !isNaN(Number(value))
      ).length === values.filter(
        (value) =>
          value !== "" &&
          value !== null &&
          value !== undefined
      ).length;

    return {
      column,
      type: numeric ? "Numeric" : "Text",
      missing,
      unique,
      status:
        missing === 0
          ? "Healthy"
          : "Needs Attention",
    };
  });

  return (
    <div className="column-stats-box">
      <h3>📊 Column Statistics</h3>

      <table className="column-stats-table">
        <thead>
          <tr>
            <th>Column</th>
            <th>Type</th>
            <th>Missing</th>
            <th>Unique</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {statistics.map((item) => (
            <tr key={item.column}>
              <td>{item.column}</td>
              <td>{item.type}</td>
              <td>{item.missing}</td>
              <td>{item.unique}</td>
              <td>
                {item.status === "Healthy"
                  ? "✅ Healthy"
                  : "⚠ Needs Attention"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ColumnStatistics;