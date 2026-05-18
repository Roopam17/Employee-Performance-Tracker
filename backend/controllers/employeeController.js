// controllers/employeeController.js - Employee CRUD Operations

const Employee = require("../models/Employee");

// ─── @desc    Create a new employee
// ─── @route   POST /api/employees
// ─── @access  Private
const createEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, yearsOfExperience } = req.body;

    // Check for duplicate email
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Employee with this email already exists" });
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      yearsOfExperience,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get all employees (with optional filtering)
// ─── @route   GET /api/employees
// ─── @access  Private
const getAllEmployees = async (req, res, next) => {
  try {
    const { department, minScore, maxScore, sortBy = "createdAt", order = "desc" } = req.query;

    // Build dynamic filter object
    const filter = {};
    if (department) filter.department = department;
    if (minScore || maxScore) {
      filter.performanceScore = {};
      if (minScore) filter.performanceScore.$gte = Number(minScore);
      if (maxScore) filter.performanceScore.$lte = Number(maxScore);
    }

    const sortOrder = order === "asc" ? 1 : -1;

    const employees = await Employee.find(filter)
      .sort({ [sortBy]: sortOrder })
      .populate("createdBy", "name email");

    res.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Search employees by name, email, or department
// ─── @route   GET /api/employees/search
// ─── @access  Private
const searchEmployees = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: "Search query 'q' is required" });
    }

    // Case-insensitive regex search across multiple fields
    const regex = new RegExp(q, "i");
    const employees = await Employee.find({
      $or: [
        { name: regex },
        { email: regex },
        { department: regex },
        { skills: regex },
      ],
    });

    res.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get single employee by ID
// ─── @route   GET /api/employees/:id
// ─── @access  Private
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).populate("createdBy", "name email");

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update employee details
// ─── @route   PUT /api/employees/:id
// ─── @access  Private
const updateEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, yearsOfExperience } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Check duplicate email on update (exclude current employee)
    if (email && email !== employee.email) {
      const duplicate = await Employee.findOne({ email });
      if (duplicate) {
        return res.status(400).json({ success: false, message: "Email already in use by another employee" });
      }
    }

    // Update fields
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, department, skills, performanceScore, yearsOfExperience },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Delete an employee
// ─── @route   DELETE /api/employees/:id
// ─── @access  Private
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    await Employee.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  searchEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
