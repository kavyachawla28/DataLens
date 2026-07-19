import { useState } from "react";

function UploadBox({
  file,
  loading,
  error,
  handleFileChange,
  handleUpload,
}) {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files.length > 0) {
      handleFileChange({
        target: {
          files: e.dataTransfer.files,
        },
      });
    }
  };

  return (
    <div
      className={`upload-box ${
        dragging ? "drag-active" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2>Upload your CSV file</h2>

      <p className="drop-text">
        Drag & Drop your CSV here
      </p>

      <p>or</p>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />

      {file && (
  <div className="selected-file-card">
    <div className="file-icon">📄</div>

    <div className="file-details">
      <h4>{file.name}</h4>
      <p>CSV Ready for Analysis</p>
    </div>
  </div>
)}

      <button
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Analyzing Dataset..." : "Analyze CSV"}
      </button>

    {loading && (
  <p className="loading-text">
    Processing your dataset...
  </p>
)}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}
    </div>
  );
}

export default UploadBox;