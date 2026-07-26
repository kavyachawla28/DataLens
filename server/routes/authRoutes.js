const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  sendResetOTP,
  changePassword,
  deleteAccount,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-reset-otp", sendResetOTP);

// Protected Routes
router.put("/change-password", authMiddleware, changePassword);
router.delete("/delete", authMiddleware, deleteAccount);
const User = require("../models/User");

router.get("/users", async (req, res) => {
  const users = await User.find({}, { name: 1, email: 1 });
  res.json(users);
});
module.exports = router;