const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const csvRoutes = require("./routes/csvRoutes");
const historyRoutes = require("./routes/historyRoutes"); // <-- ADD THIS

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/csv", csvRoutes);
app.use("/api/history", historyRoutes); // <-- ADD THIS

app.get("/", (req, res) => {
  res.send("DataLens API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DataLens backend running on port ${PORT}`);
});