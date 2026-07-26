import {
  FaUserCircle,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";

function ProfileModal({
  user,
  onClose,
  onChangePassword,
  onDeleteAccount,
  onLogout,
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "420px",
          background: "#ffffff",
          borderRadius: "18px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "30px",
            textAlign: "center",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <FaUserCircle size={70} color="#2563eb" />

          <h2
  style={{
    marginTop: "12px",
    marginBottom: "5px",
    color: "#111827",
    fontWeight: "700",
  }}
>
  {user?.name}
</h2>
          <p
            style={{
              margin: 0,
              color: "#6b7280",
            }}
          >
            {user?.email}
          </p>
        </div>

        {/* User Info */}
        <div
          style={{
            padding: "22px",
          }}
        >
          <InfoRow
            icon={<FaUserCircle color="#2563eb" />}
            title="Name"
            value={user?.name}
          />

          <InfoRow
            icon={<FaEnvelope color="#2563eb" />}
            title="Email"
            value={user?.email}
          />

          <InfoRow
            icon={<FaCalendarAlt color="#2563eb" />}
            title="Account"
            value="DataLens User"
          />
        </div>

        {/* Buttons */}
        <div
          style={{
            padding: "20px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            onClick={onChangePassword}
            style={{
              width: "100%",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "15px",
              fontSize: "16px",
              fontWeight: "700",
              textAlign: "left",
              cursor: "pointer",
              marginBottom: "12px",
            }}
          >
            🔒 Change Password
          </button>

          <button
            onClick={onLogout}
            style={{
              width: "100%",
              background: "#f59e0b",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "15px",
              fontSize: "16px",
              fontWeight: "700",
              textAlign: "left",
              cursor: "pointer",
              marginBottom: "12px",
            }}
          >
            🚪 Logout
          </button>

          <button
            onClick={onDeleteAccount}
            style={{
              width: "100%",
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "15px",
              fontSize: "16px",
              fontWeight: "700",
              textAlign: "left",
              cursor: "pointer",
              marginBottom: "12px",
            }}
          >
            🗑 Delete Account
          </button>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              background: "#6b7280",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "15px",
              fontSize: "16px",
              fontWeight: "700",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, title, value }) {
  return (
    <div
      style={{
        marginBottom: "18px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: "600",
          color: "#111827",
        }}
      >
        {icon}
        {title}
      </div>

      <div
        style={{
          marginLeft: "30px",
          marginTop: "5px",
          color: "#6b7280",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default ProfileModal;