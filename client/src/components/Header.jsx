import {
  FaDatabase,
  FaUpload,
  FaChartBar,
  FaDownload,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };

  return (
    <>
      <div className="hero-icon">
        <FaDatabase />
      </div>

      <h1>DataLens</h1>

      <p className="subtitle">
        Professional CSV Analytics Platform
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          marginTop: "10px",
          fontWeight: "600",
          color: "#444",
        }}
      >
        <FaUserCircle />
        <span>Welcome, {user?.name || "User"}</span>
      </div>

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

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </>
  );
}

export default Header;