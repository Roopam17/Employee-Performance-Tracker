// routes/aiRoutes.js - AI Recommendation Routes (all protected)

const express = require("express");
const router = express.Router();
const { getAIRecommendation, rankAllEmployees } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// All AI routes require authentication
router.use(protect);

// POST /api/ai/recommend - Get AI recommendation for a single employee
router.post("/recommend", getAIRecommendation);

// POST /api/ai/rank-all - Rank all employees using AI
router.post("/rank-all", rankAllEmployees);

module.exports = router;
