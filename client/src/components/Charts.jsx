import { useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const CustomTooltip = ({
  active,
  payload,
  label,
  selectedColumn,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "white",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 20px rgba(0,0,0,.1)",
        }}
      >
        <p>
          <strong>Record:</strong> {label}
        </p>

        <p
          style={{
            color: "#2563eb",
            marginTop: "8px",
          }}
        >
          <strong>{selectedColumn}:</strong>{" "}
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

function Charts({
  numericColumns,
  selectedColumn,
  setSelectedColumn,
  chartData,
  columnInsights,
}) {
  const [chartType, setChartType] = useState("bar");

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#14b8a6",
    "#ec4899",
  ];

  if (numericColumns.length === 0) return null;

  return (
    <div className="chart-box">
      <h3>Visualize Numeric Data</h3>

      <select
        value={selectedColumn}
        onChange={(e) =>
          setSelectedColumn(e.target.value)
        }
      >
        <option value="">
          Select a numeric column
        </option>

        {numericColumns.map((column) => (
          <option
            key={column}
            value={column}
          >
            {column}
          </option>
        ))}
      </select>

      <br />
      <br />

      <select
        value={chartType}
        onChange={(e) =>
          setChartType(e.target.value)
        }
      >
        <option value="bar">
          📊 Bar Chart
        </option>

        <option value="line">
          📈 Line Chart
        </option>

        <option value="pie">
          🥧 Pie Chart
        </option>
      </select>

      {selectedColumn && (
        <div className="chart-area">
          <h3>
            {selectedColumn} Analysis
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <>
              {chartType === "bar" && (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={
                      <CustomTooltip
                        selectedColumn={
                          selectedColumn
                        }
                      />
                    }
                  />
                  <Bar
                    dataKey="value"
                    fill="#2563eb"
                  />
                </BarChart>
              )}

              {chartType === "line" && (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={
                      <CustomTooltip
                        selectedColumn={
                          selectedColumn
                        }
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                </LineChart>
              )}

              {chartType === "pie" && (
                <PieChart>
                  <Tooltip />

                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    label
                  >
                    {chartData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>
                </PieChart>
              )}
            </>
          </ResponsiveContainer>

          {columnInsights && (
            <div className="insights-grid">
              <div className="insight-card">
                <h4>Average</h4>
                <p>
                  {columnInsights.average}
                </p>
              </div>

              <div className="insight-card">
                <h4>Minimum</h4>
                <p>
                  {columnInsights.minimum}
                </p>
              </div>

              <div className="insight-card">
                <h4>Maximum</h4>
                <p>
                  {columnInsights.maximum}
                </p>
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