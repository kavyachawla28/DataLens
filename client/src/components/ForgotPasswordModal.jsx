import { useState } from "react";

function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const sendOTP = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/send-reset-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert(data.message);
      setStep(2);

    } catch (err) {
      alert(err.message);
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-reset-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert(data.message);
      setStep(3);

    } catch (err) {
      alert(err.message);
    }
  };

  const resetPassword = async () => {

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Password reset successfully.");

      onClose();

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      onClick={onClose}
      style={overlay}
    >
      <div
        onClick={(e)=>e.stopPropagation()}
        style={modal}
      >

        <h2>Forgot Password</h2>

        {step===1 && (
          <>
            <input
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              style={input}
            />

            <button
              onClick={sendOTP}
              style={primary}
            >
              Send OTP
            </button>
          </>
        )}

        {step===2 && (
          <>
            <input
              value={email}
              disabled
              style={input}
            />

            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
              style={input}
            />

            <button
              onClick={verifyOTP}
              style={primary}
            >
              Verify OTP
            </button>
          </>
        )}

        {step===3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e)=>setNewPassword(e.target.value)}
              style={input}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              style={input}
            />

            <button
              onClick={resetPassword}
              style={primary}
            >
              Reset Password
            </button>
          </>
        )}

        <button
          onClick={onClose}
          style={secondary}
        >
          Close
        </button>

      </div>
    </div>
  );
}

const overlay={
  position:"fixed",
  inset:0,
  background:"rgba(0,0,0,.55)",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  zIndex:999999
};

const modal={
  width:"420px",
  background:"#fff",
  borderRadius:"16px",
  padding:"28px"
};

const input={
  width:"100%",
  padding:"12px",
  marginBottom:"15px",
  border:"1px solid #ddd",
  borderRadius:"8px",
  boxSizing:"border-box"
};

const primary={
  width:"100%",
  padding:"12px",
  background:"#2563eb",
  color:"#fff",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer",
  marginBottom:"10px"
};

const secondary={
  width:"100%",
  padding:"12px",
  background:"#6b7280",
  color:"#fff",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer"
};

export default ForgotPasswordModal;