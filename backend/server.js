// Dependencies
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Route handlers
const auth_routes = require("./routes/auth.route");
const meet_routes = require("./routes/meet.route");

// Configurations
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Change this to match your frontend's URL
    credentials: true, // Allow cookies
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
require("dotenv").config();

// MongoDB connection
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

auth_routes(app);
meet_routes(app);

const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
