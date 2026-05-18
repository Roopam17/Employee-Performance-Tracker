// src/pages/EditEmployeePage.jsx - Edit Existing Employee Details

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { Save, X, Plus, ArrowLeft } from "lucide-react";

const DEPARTMENTS = [
  "Engineering", "Marketing", "Sales", "HR", "Finance",
  "Operations", "Design", "Product", "Legal", "Customer Support",
];

const EditEmployeePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    performanceScore: "",
    yearsOfExperience: "",
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        const emp = res.data.data;
        setFormData({
          name: emp.name,
          email: emp.email,
          department: emp.department,
          performanceScore: emp.performanceScore,
          yearsOfExperience: emp.yearsOfExperience,
        });
        setSkills(emp.skills || []);
      } catch (err) {
        toast.error("Employee not found");
        navigate("/employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (skill) => setSkills((prev) => prev.filter((s) => s !== skill));

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (skills.length === 0) newErrors.skills = "Add at least one skill";
    if (!formData.performanceScore) newErrors.performanceScore = "Score required";
    else if (Number(formData.performanceScore) < 0 || Number(formData.performanceScore) > 100)
      newErrors.performanceScore = "Score must be 0-100";
    if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Experience required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      await api.put(`/employees/${id}`, {
        ...formData,
        skills,
        performanceScore: Number(formData.performanceScore),
        yearsOfExperience: Number(formData.yearsOfExperience),
      });
      toast.success("Employee updated successfully!");
      navigate("/employees");
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="section-title">Edit Employee</h1>
          <p className="text-slate-400 text-sm">Update employee information</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Employee Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className={`input-field ${errors.name ? "border-red-500" : ""}`} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className={`input-field ${errors.email ? "border-red-500" : ""}`} />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Department</label>
            <select name="department" value={formData.department} onChange={handleChange}
              className={`input-field ${errors.department ? "border-red-500" : ""}`}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Skills</label>
            <div className="flex gap-2">
              <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                placeholder="Type a skill and press Enter" className="input-field flex-1" />
              <button type="button" onClick={addSkill} className="btn-secondary px-3">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {errors.skills && <p className="text-red-400 text-xs mt-1">{errors.skills}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-blue-400 hover:text-blue-200">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Performance Score</label>
              <input type="number" name="performanceScore" value={formData.performanceScore}
                onChange={handleChange} min="0" max="100"
                className={`input-field ${errors.performanceScore ? "border-red-500" : ""}`} />
              {errors.performanceScore && <p className="text-red-400 text-xs mt-1">{errors.performanceScore}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Years of Experience</label>
              <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience}
                onChange={handleChange} min="0"
                className={`input-field ${errors.yearsOfExperience ? "border-red-500" : ""}`} />
              {errors.yearsOfExperience && <p className="text-red-400 text-xs mt-1">{errors.yearsOfExperience}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
              ) : (
                <><Save className="w-4 h-4" />Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeePage;
