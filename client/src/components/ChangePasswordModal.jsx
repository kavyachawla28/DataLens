import { useState } from "react";

function ChangePasswordModal({
  onClose,
  onForgotPassword,
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return alert("All fields are required.");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match.");
    }

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

      onClose();

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999999,
      }}
    >
      <div
        onClick={(e)=>e.stopPropagation()}
        style={{
          width: "420px",
          background: "#fff",
          borderRadius: "16px",
          padding: "28px",
        }}
      >
        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e)=>setCurrentPassword(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          style={inputStyle}
        />

        <div
          style={{
            textAlign:"right",
            marginBottom:"18px"
          }}
        >
          <button
            onClick={onForgotPassword}
            style={{
              background:"none",
              border:"none",
              color:"#2563eb",
              cursor:"pointer",
              fontWeight:"600"
            }}
          >
            Forgot Current Password?
          </button>
        </div>

        <button
          onClick={handleSubmit}
          style={primaryBtn}
        >
          Change Password
        </button>

        <button
          onClick={onClose}
          style={secondaryBtn}
        >
          Cancel
        </button>

      </div>
    </div>
  );
}

const inputStyle={
  width:"100%",
  padding:"12px",
  marginBottom:"14px",
  border:"1px solid #ddd",
  borderRadius:"8px",
  fontSize:"15px",
  boxSizing:"border-box"
};

const primaryBtn={
  width:"100%",
  padding:"12px",
  background:"#2563eb",
  color:"#fff",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer",
  fontWeight:"600",
  marginBottom:"10px"
};

const secondaryBtn={
  width:"100%",
  padding:"12px",
  background:"#6b7280",
  color:"#fff",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer",
  fontWeight:"600"
};

export default ChangePasswordModal;