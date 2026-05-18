// models/Employee.js - Mongoose Schema for Employee Data

const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: [
        "Engineering",
        "Marketing",
        "Sales",
        "HR",
        "Finance",
        "Operations",
        "Design",
        "Product",
        "Legal",
        "Customer Support",
      ],
    },
    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Skills array cannot be empty",
      },
    },
    performanceScore: {
      type: Number,
      required: [true, "Performance score is required"],
      min: [0, "Performance score cannot be less than 0"],
      max: [100, "Performance score cannot exceed 100"],
    },
    yearsOfExperience: {
      type: Number,
      required: [true, "Years of experience is required"],
      min: [0, "Years of experience cannot be negative"],
      max: [50, "Years of experience seems too high"],
    },
    // Stores AI-generated recommendation for this employee
    aiRecommendation: {
      type: String,
      default: null,
    },
    // Timestamp of last AI analysis
    lastAnalyzed: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Index for search functionality
employeeSchema.index({ name: "text", email: "text", department: "text" });

module.exports = mongoose.model("Employee", employeeSchema);
