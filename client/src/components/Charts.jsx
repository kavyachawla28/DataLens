import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function Charts({
  numericColumns,
  selectedColumn,
  setSelectedColumn,
  chartData,
  columnInsights,
}) {
  if (numericColumns.length === 0) return null;

  return (
    <div className="chart-box">
      <h3>Visualize Numeric Data</h3>

      <select
        value={selectedColumn}
        onChange={(e) => setSelectedColumn(e.target.value)}
      >
        <option value="">Select a numeric column</option>

        {numericColumns.map((column) => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </select>

      {selectedColumn && (
        <div className="chart-area">
          <h3>{selectedColumn} Analysis</h3>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>

          {columnInsights && (
            <div className="insights-grid">
              <div className="insight-card">
                <h4>Average</h4>
                <p>{columnInsights.average}</p>
              </div>

              <div className="insight-card">
                <h4>Minimum</h4>
                <p>{columnInsights.minimum}</p>
              </div>

              <div className="insight-card">
                <h4>Maximum</h4>
               <p>{columnInsights.maximum}</p>
              </div>

              <div className="insight-card">
                <h4>Sum</h4>
                <p>{columnInsights.sum}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Charts;