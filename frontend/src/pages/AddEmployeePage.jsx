// src/pages/AddEmployeePage.jsx - Employee Registration Form

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import { UserPlus, X, Plus, ArrowLeft } from "lucide-react";

const DEPARTMENTS = [
  "Engineering", "Marketing", "Sales", "HR", "Finance",
  "Operations", "Design", "Product", "Legal", "Customer Support",
];

const AddEmployeePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    performanceScore: "",
    yearsOfExperience: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Add skill chip
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      toast.error("Skill already added");
      return;
    }
    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
    if (errors.skills) setErrors((prev) => ({ ...prev, skills: "" }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!formData.department) newErrors.department = "Department is required";
    if (skills.length === 0) newErrors.skills = "Add at least one skill";
    if (!formData.performanceScore) newErrors.performanceScore = "Performance score is required";
    else if (
      isNaN(Number(formData.performanceScore)) ||
      Number(formData.performanceScore) < 0 ||
      Number(formData.performanceScore) > 100
    )
      newErrors.performanceScore = "Score must be between 0 and 100";
    if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of experience is required";
    else if (Number(formData.yearsOfExperience) < 0)
      newErrors.yearsOfExperience = "Experience cannot be negative";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post("/employees", {
        ...formData,
        skills,
        performanceScore: Number(formData.performanceScore),
        yearsOfExperience: Number(formData.yearsOfExperience),
      });
      toast.success("Employee added successfully!");
      navigate("/employees");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add employee";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="section-title">Add Employee</h1>
          <p className="text-slate-400 text-sm">Register a new employee in the system</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Employee Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              className={`input-field ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="employee@company.com"
              className={`input-field ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Department <span className="text-red-400">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`input-field ${errors.department ? "border-red-500" : ""}`}
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Skills <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill and press Enter"
                className={`input-field flex-1 ${errors.skills ? "border-red-500" : ""}`}
              />
              <button type="button" onClick={addSkill} className="btn-secondary px-3">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {errors.skills && <p className="text-red-400 text-xs mt-1">{errors.skills}</p>}
            {/* Skill Chips */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-400 hover:text-blue-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Score & Experience Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Performance Score <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="performanceScore"
                value={formData.performanceScore}
                onChange={handleChange}
                placeholder="0 - 100"
                min="0"
                max="100"
                className={`input-field ${errors.performanceScore ? "border-red-500" : ""}`}
              />
              {errors.performanceScore && (
                <p className="text-red-400 text-xs mt-1">{errors.performanceScore}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Years of Experience <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="e.g. 3"
                min="0"
                className={`input-field ${errors.yearsOfExperience ? "border-red-500" : ""}`}
              />
              {errors.yearsOfExperience && (
                <p className="text-red-400 text-xs mt-1">{errors.yearsOfExperience}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Add Employee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeePage;
