function SearchSortFilter({
  searchTerm,
  setSearchTerm,
  sortColumn,
  setSortColumn,
  sortOrder,
  setSortOrder,
  filterColumn,
  setFilterColumn,
  filterValue,
  setFilterValue,
  dataset,
}) {
  return (
    <>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search records..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      <div className="sort-box">
        <select
          value={sortColumn}
          onChange={(e) =>
            setSortColumn(e.target.value)
          }
        >
          <option value="">Sort Column</option>

          {dataset.columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value)
          }
        >
          <option value="asc">
            Ascending
          </option>

          <option value="desc">
            Descending
          </option>
        </select>
      </div>

      <div className="filter-box">
        <select
          value={filterColumn}
          onChange={(e) =>
            setFilterColumn(e.target.value)
          }
        >
          <option value="">
            Filter Column
          </option>

          {dataset.columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filter Value"
          value={filterValue}
          onChange={(e) =>
            setFilterValue(e.target.value)
          }
        />
      </div>
    </>
  );
}

export default SearchSortFilter;