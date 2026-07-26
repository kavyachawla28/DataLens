const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { sendEmail } = require("../utils/mailService");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ======================
// Register
// ======================

const registerUser = async (req, res) => {
  try {
    console.log(req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
try {
  await sendEmail(
    user.email,
    "🎉 Welcome to DataLens",
    `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:10px; overflow:hidden;">
      
      <div style="background:#2563eb; color:white; padding:20px; text-align:center;">
        <h1>Welcome to DataLens</h1>
      </div>

      <div style="padding:30px; color:#333;">
        <h2>Hello ${user.name},</h2>

        <p>
          Your DataLens account has been created successfully.
        </p>

        <p>
          You can now securely log in and start analyzing your datasets.
        </p>

        <table style="margin-top:20px;">
          <tr>
            <td><strong>Name:</strong></td>
            <td>${user.name}</td>
          </tr>

          <tr>
            <td><strong>Email:</strong></td>
            <td>${user.email}</td>
          </tr>
        </table>

        <br>

        <p>
          Thank you for choosing DataLens.
        </p>

        <p>
          Happy Analyzing! 📊
        </p>
      </div>

      <div style="background:#f3f4f6; padding:15px; text-align:center; color:#666;">
        © DataLens
      </div>

    </div>
    `
  );
} catch (err) {
  console.error("Welcome email failed:", err);
}
    return res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// Login
// ======================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// Change Password
// ======================

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.json({
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// ======================
// Delete Account
// ======================

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndDelete(userId);

    return res.json({
      message: "Account deleted successfully",
    });

  } catch (error) {
    console.error("DELETE ACCOUNT ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
  deleteAccount,
};