// routes/authRoutes.js - Authentication Routes

const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/signup - Register a new user
router.post("/signup", signup);

// POST /api/auth/login - Login and get JWT
router.post("/login", login);

// GET /api/auth/me - Get current logged-in user profile (protected)
router.get("/me", protect, getMe);

module.exports = router;
