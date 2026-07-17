import { FaDatabase, FaUpload, FaChartBar, FaDownload } from "react-icons/fa";

function Header() {
  return (
    <>
      <div className="hero-icon">
        <FaDatabase />
      </div>

      <h1>DataLens</h1>

      <p className="subtitle">
        Professional CSV Analytics Platform
      </p>

      <div className="hero-features">
        <span>
          <FaUpload /> Upload
        </span>

        <span>
          <FaChartBar /> Analyze
        </span>

        <span>
          <FaDownload /> Export
        </span>
      </div>
    </>
  );
}

export default Header;