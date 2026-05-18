// src/pages/DashboardPage.jsx - Main Analytics Dashboard

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../utils/api.js";
import StatCard from "../components/StatCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { Users, TrendingUp, Award, AlertTriangle, BrainCircuit, Plus } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        setEmployees(res.data.data);
      } catch (err) {
        setError("Failed to load employee data.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Compute dashboard statistics
  const stats = {
    total: employees.length,
    avgScore:
      employees.length > 0
        ? Math.round(employees.reduce((sum, e) => sum + e.performanceScore, 0) / employees.length)
        : 0,
    topPerformers: employees.filter((e) => e.performanceScore >= 85).length,
    needsImprovement: employees.filter((e) => e.performanceScore < 50).length,
  };

  // Department distribution
  const deptMap = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});

  const departments = Object.entries(deptMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Top 5 performers
  const topEmployees = [...employees]
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 5);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="text-slate-400 text-sm">Welcome back, {user?.name} 👋</p>
        </div>
        <button onClick={() => navigate("/employees/add")} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={stats.total}
          icon={Users}
          color="blue"
          subtitle="All registered employees"
        />
        <StatCard
          title="Avg. Performance"
          value={`${stats.avgScore}%`}
          icon={TrendingUp}
          color="green"
          subtitle="Company-wide average"
        />
        <StatCard
          title="Top Performers"
          value={stats.topPerformers}
          icon={Award}
          color="yellow"
          subtitle="Score ≥ 85"
        />
        <StatCard
          title="Needs Support"
          value={stats.needsImprovement}
          icon={AlertTriangle}
          color="red"
          subtitle="Score < 50"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers List */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Top Performers</h2>
            <Award className="w-5 h-5 text-yellow-400" />
          </div>
          {topEmployees.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">
              No employees yet.{" "}
              <button
                onClick={() => navigate("/employees/add")}
                className="text-blue-400 hover:underline"
              >
                Add one
              </button>
            </p>
          ) : (
            <div className="space-y-3">
              {topEmployees.map((emp, idx) => (
                <div
                  key={emp._id}
                  className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg"
                >
                  {/* Rank Badge */}
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      idx === 0
                        ? "bg-yellow-500/20 text-yellow-400"
                        : idx === 1
                        ? "bg-slate-500/20 text-slate-300"
                        : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{emp.name}</p>
                    <p className="text-xs text-slate-400">{emp.department}</p>
                  </div>
                  <span className="text-sm font-bold text-green-400">{emp.performanceScore}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">By Department</h2>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          {departments.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">No data available</p>
          ) : (
            <div className="space-y-3">
              {departments.map(([dept, count]) => (
                <div key={dept}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">{dept}</span>
                    <span className="text-xs text-slate-400">{count} employees</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div
                      className="h-1.5 bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendation CTA */}
      <div className="card border-blue-500/30 bg-blue-500/5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI-Powered Insights</h3>
              <p className="text-sm text-slate-400">
                Get promotion recommendations, training suggestions, and performance feedback
              </p>
            </div>
          </div>
          <button onClick={() => navigate("/ai-recommend")} className="btn-primary">
            <BrainCircuit className="w-4 h-4" />
            Analyze Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
