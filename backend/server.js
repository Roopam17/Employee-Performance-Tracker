// ============================================================
// server.js - Main Entry Point for Express Application
// AI-Based Employee Performance Analytics & Recommendation System
// ============================================================

const path = require("path");
const fs   = require("fs");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// ─── Load .env with an absolute path ─────────────────────────
const envPath = path.resolve(__dirname, ".env");
console.log("🔍 Looking for .env at:", envPath);
console.log("🔍 .env file exists:", fs.existsSync(envPath));

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("❌ dotenv failed to load:", result.error.message);
} else {
  console.log("✅ .env loaded successfully");
}

// ─── Validate required environment variables ─────────────────
const REQUIRED_VARS = ["MONGODB_URI", "JWT_SECRET"];
const missing = REQUIRED_VARS.filter((v) => !process.env[v]);
if (missing.length > 0) {
  console.error(`\n❌ MISSING ENVIRONMENT VARIABLES: ${missing.join(", ")}`);
  console.error(`   Check that backend/.env exists and contains these keys.\n`);
  process.exit(1);
}

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Employee Performance API is running 🚀", status: "OK" });
});

// ─── Error Handler (must be last) ────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
