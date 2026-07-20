import React, { useMemo, useState } from "react";
import { FaTrash, FaStar, FaRegStar } from "react-icons/fa";

function DatasetManager({
  history,
  onDelete,
  onFavorite,
}) {
  const [search, setSearch] = useState("");
const totalDatasets = history.length;

const favoriteDatasets = history.filter(
  (item) => item.favorite
).length;
  const filteredHistory = useMemo(() => {
    return [...history]
      .filter((item) =>
        item.fileName
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (a.favorite === b.favorite) {
          return (
            new Date(b.createdAt) -
            new Date(a.createdAt)
          );
        }
        return b.favorite - a.favorite;
      });
  }, [history, search]);

  return (
    <div className="dataset-manager">
      <h2>📂 Dataset Manager</h2>

      <input
        type="text"
        placeholder="Search datasets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="dataset-search"
      />
<div className="dataset-stats">
  <div className="dataset-stat-card">
    <h3>{totalDatasets}</h3>
    <p>Total Datasets</p>
  </div>

  <div className="dataset-stat-card">
    <h3>{favoriteDatasets}</h3>
    <p>Favorites</p>
  </div>
</div>
      {filteredHistory.length === 0 ? (
        <p>No datasets found.</p>
      ) : (
        filteredHistory.map((item) => (
          <div
            key={item._id}
            className="dataset-card"
          >
            <div>
              <h4>{item.fileName}</h4>

              <p>
                {item.rows} Rows • {item.columns} Columns
              </p>

              <small>
                Quality: {item.qualityScore}%
              </small>
            </div>

            <div className="dataset-actions">
              <button
                className="favorite-btn"
                onClick={() =>
                  onFavorite(item._id)
                }
              >
                {item.favorite ? (
                  <FaStar />
                ) : (
                  <FaRegStar />
                )}
              </button>

              <button
                className="delete-history-btn"
                onClick={() =>
                  onDelete(item._id)
                }
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DatasetManager;