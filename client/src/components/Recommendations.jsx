function Recommendations({ dataset }) {
  if (!dataset) return null;

  const recommendations = [];

 if (dataset.missingValues >= 20) {
  recommendations.push(
    "Large number of missing values detected. Consider cleaning the dataset before analysis."
  );
} else if (dataset.missingValues > 0) {
  recommendations.push(
    "Only a few missing values detected. Filling them may improve analysis quality."
  );
}

if (dataset.duplicateRows >= 10) {
  recommendations.push(
    "High duplicate count detected. Remove duplicates before further analysis."
  );
} else if (dataset.duplicateRows > 0) {
  recommendations.push(
    "A few duplicate rows were found. Consider removing them."
  );
}
  if (dataset.columnCount > 20) {
    recommendations.push(
      "Large datasets may benefit from feature selection."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Excellent dataset! No improvements are currently recommended."
    );
  }

  return (
    <div className="recommendation-box">
      <h2>💡 Data Quality Recommendations</h2>

      {recommendations.map((item, index) => (
        <div key={index} className="recommendation-item">
          ✅ {item}
        </div>
      ))}
    </div>
  );
}

export default Recommendations;