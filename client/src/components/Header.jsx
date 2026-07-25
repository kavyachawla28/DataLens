import { useState, useRef, useEffect } from "react";

import {
  FaDatabase,
  FaUpload,
  FaChartBar,
  FaDownload,
  FaSignOutAlt,
  FaUserCircle,
  FaTrash,
  FaUserCog,
} from "react-icons/fa";

import { deleteAccount } from "../api/auth";
import ProfileModal from "./ProfileModal";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete your account."
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await deleteAccount(token);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert("Account deleted successfully.");

      window.location.reload();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete account."
      );
    }
  };

  const handleChangePassword = async () => {
    const currentPassword = prompt(
      "Enter your current password:"
    );

    if (!currentPassword) return;

    const newPassword = prompt(
      "Enter your new password:"
    );

    if (!newPassword) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Password changed successfully.");

      setShowProfile(false);
    } catch (err) {
      alert(err.message || "Failed to change password.");
    }
  };

  const menuButtonStyle = {
  width: "100%",
  padding: "14px 18px",
  border: "none",
  background: "#fff",
  color: "#111827",      // <-- ADD THIS
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "10px",
  fontSize: "15px",
  fontWeight: "600",
  borderBottom: "1px solid #eee",
  transition: "0.2s",
};

  return (
    <>
      {/* Profile Menu */}
      <div
        ref={menuRef}
        style={{
          position: "absolute",
          top: "25px",
          right: "35px",
          zIndex: 999,
        }}
      >
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "42px",
            color: "#2563eb",
          }}
        >
          <FaUserCircle />
        </button>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "55px",
              width: "250px",
              background: "#fff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #eee",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {user?.name}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#666",
                }}
              >
                {user?.email}
              </div>
            </div>

            <button
              style={menuButtonStyle}
              onClick={() => {
                setShowProfile(true);
                setShowMenu(false);
              }}
            >
              <FaUserCog />
              My Profile
            </button>

            <button
              style={menuButtonStyle}
              onClick={handleChangePassword}
            >
              🔒 Change Password
            </button>

            <button
              style={menuButtonStyle}
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </button>

            <button
              style={{
                ...menuButtonStyle,
                color: "#dc2626",
                borderBottom: "none",
              }}
              onClick={handleDeleteAccount}
            >
              <FaTrash />
              Delete Account
            </button>
          </div>
        )}
      </div>

      {/* Hero Section */}
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
        <span>
          Welcome, {user?.name || "User"}
        </span>
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

      {showProfile && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
          onChangePassword={handleChangePassword}
          onDeleteAccount={handleDeleteAccount}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default Header;