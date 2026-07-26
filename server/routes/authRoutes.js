const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  changePassword,
  deleteAccount,
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Forgot Password
router.post("/send-reset-otp", sendResetOTP);
router.post("/verify-reset-otp", verifyResetOTP);
router.put("/reset-password", resetPassword);

// Protected Routes
router.put("/change-password", authMiddleware, changePassword);
router.delete("/delete", authMiddleware, deleteAccount);

module.exports = router;