const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const csvRoutes = require("./routes/csvRoutes");
const historyRoutes = require("./routes/historyRoutes"); // <-- ADD THIS
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/csv", csvRoutes);
app.use("/api/history", historyRoutes);
app.get("/", (req, res) => {
  res.send("DataLens API is running");
});
app.post("/test", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DataLens backend running on port ${PORT}`);
});