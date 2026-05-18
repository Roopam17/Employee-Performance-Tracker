// src/pages/AIRecommendationPage.jsx - AI Analysis & Recommendations Page

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { BrainCircuit, Users, Sparkles, ChevronDown, Trophy, AlertCircle } from "lucide-react";

const AIRecommendationPage = () => {
  const location = useLocation();
  const preselectedEmployee = location.state?.employee;

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(preselectedEmployee || null);
  const [recommendation, setRecommendation] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rankLoading, setRankLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("individual");

  // Fetch employees list for dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        setEmployees(res.data.data);
      } catch {
        toast.error("Failed to load employees");
      } finally {
        setEmployeesLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // If we have existing AI recommendation for this employee, show it
  useEffect(() => {
    if (preselectedEmployee?.aiRecommendation) {
      setRecommendation(preselectedEmployee.aiRecommendation);
    }
  }, [preselectedEmployee]);

  // Generate AI recommendation for selected employee
  const handleGetRecommendation = async () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee first");
      return;
    }
    setLoading(true);
    setRecommendation(null);
    try {
      const res = await api.post("/ai/recommend", { employeeId: selectedEmployee._id });
      setRecommendation(res.data.data.recommendation);
      toast.success("AI analysis complete!");
    } catch (err) {
      const msg = err.response?.data?.message || "AI analysis failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Generate AI ranking for all employees
  const handleRankAll = async () => {
    setRankLoading(true);
    setRanking(null);
    try {
      const res = await api.post("/ai/rank-all");
      setRanking(res.data.data.ranking);
      toast.success("Employee ranking generated!");
    } catch (err) {
      const msg = err.response?.data?.message || "Ranking failed";
      toast.error(msg);
    } finally {
      setRankLoading(false);
    }
  };

  // Format AI text response into readable paragraphs
  const formatAIResponse = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <h3 key={i} className="text-blue-400 font-semibold text-base mt-4 mb-1">{line.replace(/\*\*/g, "")}</h3>;
      }
      if (line.startsWith("## ") || line.startsWith("# ")) {
        return <h2 key={i} className="text-blue-300 font-bold text-lg mt-5 mb-2">{line.replace(/^#+\s/, "")}</h2>;
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return <li key={i} className="text-slate-300 ml-4 list-disc text-sm">{line.replace(/^[-*]\s/, "")}</li>;
      }
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="text-slate-300 text-sm leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="section-title flex items-center gap-2">
          <BrainCircuit className="w-7 h-7 text-blue-400" />
          AI Recommendations
        </h1>
        <p className="text-slate-400 text-sm">
          Powered by OpenAI — get promotion advice, training suggestions, and performance feedback
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-800 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("individual")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "individual" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
        >
          Individual Analysis
        </button>
        <button
          onClick={() => setActiveTab("ranking")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "ranking" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
        >
          Team Ranking
        </button>
      </div>

      {/* Individual Analysis Tab */}
      {activeTab === "individual" && (
        <div className="space-y-4">
          {/* Employee Selector */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">Select Employee</h2>
            {employeesLoading ? (
              <LoadingSpinner text="Loading employees..." />
            ) : employees.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                No employees found. Add employees first.
              </div>
            ) : (
              <div className="space-y-3">
                {/* Dropdown */}
                <div className="relative">
                  <select
                    value={selectedEmployee?._id || ""}
                    onChange={(e) => {
                      const emp = employees.find((em) => em._id === e.target.value);
                      setSelectedEmployee(emp || null);
                      setRecommendation(null);
                    }}
                    className="input-field appearance-none pr-10"
                  >
                    <option value="">-- Choose an employee --</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} | {emp.department} | Score: {emp.performanceScore}%
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                {/* Selected Employee Preview */}
                {selectedEmployee && (
                  <div className="p-4 bg-slate-800 rounded-lg flex items-start gap-4 flex-wrap">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-400 font-bold">
                        {selectedEmployee.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">{selectedEmployee.name}</p>
                      <p className="text-sm text-slate-400">{selectedEmployee.email}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="badge bg-slate-700 text-slate-300">{selectedEmployee.department}</span>
                        <span className="badge bg-green-500/20 text-green-400">Score: {selectedEmployee.performanceScore}%</span>
                        <span className="badge bg-blue-500/20 text-blue-400">{selectedEmployee.yearsOfExperience} yrs exp</span>
                      </div>
                    </div>
                    <button
                      onClick={handleGetRecommendation}
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Analyze with AI
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Loading State */}
          {loading && (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BrainCircuit className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <p className="text-white font-medium">AI is analyzing the employee...</p>
              <p className="text-slate-400 text-sm mt-1">This usually takes 5-15 seconds</p>
            </div>
          )}

          {/* AI Recommendation Output */}
          {recommendation && !loading && (
            <div className="card border-blue-500/20">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700/50">
                <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Analysis for {selectedEmployee?.name}</h3>
                  <p className="text-xs text-slate-400">Generated by OpenAI GPT</p>
                </div>
              </div>
              <div className="space-y-1">{formatAIResponse(recommendation)}</div>
            </div>
          )}
        </div>
      )}

      {/* Team Ranking Tab */}
      {activeTab === "ranking" && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Team Performance Ranking</h2>
                <p className="text-sm text-slate-400">AI compares all {employees.length} employees and ranks them</p>
              </div>
              <button onClick={handleRankAll} disabled={rankLoading || employees.length === 0} className="btn-primary">
                {rankLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Ranking...</>
                ) : (
                  <><Trophy className="w-4 h-4" />Rank All Employees</>
                )}
              </button>
            </div>
          </div>

          {rankLoading && (
            <div className="card text-center py-12">
              <BrainCircuit className="w-10 h-10 text-blue-400 animate-pulse mx-auto mb-3" />
              <p className="text-white font-medium">Analyzing all {employees.length} employees...</p>
              <p className="text-slate-400 text-sm mt-1">This may take a moment</p>
            </div>
          )}

          {ranking && !rankLoading && (
            <div className="card border-blue-500/20">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700/50">
                <div className="w-9 h-9 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Team Ranking Report</h3>
                  <p className="text-xs text-slate-400">
                    {employees.length} employees analyzed by OpenAI GPT
                  </p>
                </div>
              </div>
              <div className="space-y-1">{formatAIResponse(ranking)}</div>
            </div>
          )}

          {/* Quick Score Table */}
          {employees.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                Score Overview
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 px-3 text-slate-400 font-medium">Rank</th>
                      <th className="text-left py-2 px-3 text-slate-400 font-medium">Name</th>
                      <th className="text-left py-2 px-3 text-slate-400 font-medium">Department</th>
                      <th className="text-left py-2 px-3 text-slate-400 font-medium">Score</th>
                      <th className="text-left py-2 px-3 text-slate-400 font-medium">Experience</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...employees]
                      .sort((a, b) => b.performanceScore - a.performanceScore)
                      .map((emp, i) => (
                        <tr key={emp._id} className="border-b border-slate-700/50 hover:bg-slate-800">
                          <td className="py-2 px-3 text-slate-400">#{i + 1}</td>
                          <td className="py-2 px-3 text-white font-medium">{emp.name}</td>
                          <td className="py-2 px-3 text-slate-300">{emp.department}</td>
                          <td className="py-2 px-3">
                            <span className={`font-bold ${emp.performanceScore >= 85 ? "text-green-400" : emp.performanceScore >= 70 ? "text-blue-400" : emp.performanceScore >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                              {emp.performanceScore}%
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-300">{emp.yearsOfExperience} yrs</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRecommendationPage;
