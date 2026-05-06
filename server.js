require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());

// 🔹 Serve frontend files
app.use(express.static("public"));

// 🔹 MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// 🔹 Routes
const donorRoutes = require("./routes/donorRoutes");
app.use("/donors", donorRoutes);

const requestRoutes = require("./routes/requestRoutes");
app.use("/requests", requestRoutes);

// 🔹 Home route
const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔹 Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});