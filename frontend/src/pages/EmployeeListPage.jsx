// src/pages/EmployeeListPage.jsx - Employee List with Search & Filter

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import EmployeeCard from "../components/EmployeeCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import toast from "react-hot-toast";
import { Search, Filter, Plus, X, Users } from "lucide-react";

const DEPARTMENTS = [
  "All", "Engineering", "Marketing", "Sales", "HR", "Finance",
  "Operations", "Design", "Product", "Legal", "Customer Support",
];

const EmployeeListPage = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState({
    department: "All",
    minScore: "",
    maxScore: "",
    sortBy: "createdAt",
    order: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch employees with current filters
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.department !== "All") params.department = filters.department;
      if (filters.minScore) params.minScore = filters.minScore;
      if (filters.maxScore) params.maxScore = filters.maxScore;
      params.sortBy = filters.sortBy;
      params.order = filters.order;

      const res = await api.get("/employees", { params });
      setEmployees(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Search employees by query
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchEmployees();
      return;
    }
    setSearchLoading(true);
    try {
      const res = await api.get("/employees/search", { params: { q: searchQuery } });
      setEmployees(res.data.data);
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  // Clear search and reload all
  const clearSearch = () => {
    setSearchQuery("");
    fetchEmployees();
  };

  // Delete employee with confirmation
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    setDeleteId(id);
    try {
      await api.delete(`/employees/${id}`);
      toast.success(`${name} deleted successfully`);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      toast.error("Failed to delete employee");
    } finally {
      setDeleteId(null);
    }
  };

  // Navigate to AI analysis page with selected employee
  const handleAnalyze = (employee) => {
    navigate("/ai-recommend", { state: { employee } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title">Employees</h1>
          <p className="text-slate-400 text-sm">{employees.length} employees found</p>
        </div>
        <button onClick={() => navigate("/employees/add")} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="card">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, department, or skill..."
              className="input-field pl-10 pr-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button type="submit" className="btn-primary" disabled={searchLoading}>
            {searchLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 ${showFilters ? "bg-blue-600" : ""}`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </form>

        {/* Advanced Filters (collapsible) */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-700/50">
            {/* Department */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters((p) => ({ ...p, department: e.target.value }))}
                className="input-field text-sm py-2"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Min Score */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Min Score</label>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.minScore}
                onChange={(e) => setFilters((p) => ({ ...p, minScore: e.target.value }))}
                placeholder="0"
                className="input-field text-sm py-2"
              />
            </div>

            {/* Max Score */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Max Score</label>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.maxScore}
                onChange={(e) => setFilters((p) => ({ ...p, maxScore: e.target.value }))}
                placeholder="100"
                className="input-field text-sm py-2"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Sort By</label>
              <select
                value={`${filters.sortBy}-${filters.order}`}
                onChange={(e) => {
                  const [sortBy, order] = e.target.value.split("-");
                  setFilters((p) => ({ ...p, sortBy, order }));
                }}
                className="input-field text-sm py-2"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="performanceScore-desc">Highest Score</option>
                <option value="performanceScore-asc">Lowest Score</option>
                <option value="name-asc">Name A-Z</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Employee Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner text="Loading employees..." />
        </div>
      ) : employees.length === 0 ? (
        <div className="card text-center py-16">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No employees found</p>
          <p className="text-slate-500 text-sm mt-1">
            {searchQuery ? "Try a different search term" : "Add your first employee to get started"}
          </p>
          {!searchQuery && (
            <button onClick={() => navigate("/employees/add")} className="btn-primary mx-auto mt-4">
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp._id}
              employee={emp}
              onDelete={handleDelete}
              onAnalyze={handleAnalyze}
              isDeleting={deleteId === emp._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeListPage;
