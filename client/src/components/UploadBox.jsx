function UploadBox({
  file,
  loading,
  error,
  handleFileChange,
  handleUpload,
}) {
  return (
    <div className="upload-box">
      <h2>Upload your CSV file</h2>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />

      {file && (
        <p className="file-name">
          Selected file: {file.name}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze CSV"}
      </button>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}
    </div>
  );
}

export default UploadBox;