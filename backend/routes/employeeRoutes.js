// routes/employeeRoutes.js - Employee CRUD Routes (all protected)

const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  searchEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");

// All employee routes require authentication
router.use(protect);

// GET /api/employees/search?q=keyword - Search employees
router.get("/search", searchEmployees);

// GET /api/employees - Get all employees (with filters)
// POST /api/employees - Create new employee
router.route("/").get(getAllEmployees).post(createEmployee);

// GET /api/employees/:id - Get single employee
// PUT /api/employees/:id - Update employee
// DELETE /api/employees/:id - Delete employee
router
  .route("/:id")
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
