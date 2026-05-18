// src/components/EmployeeCard.jsx - Individual Employee Display Card

import { useNavigate } from "react-router-dom";
import { Edit, Trash2, BrainCircuit, Star } from "lucide-react";

const EmployeeCard = ({ employee, onDelete, onAnalyze }) => {
  const navigate = useNavigate();

  // Determine performance badge color based on score
  const getScoreBadge = (score) => {
    if (score >= 85) return { label: "Top Performer", classes: "bg-green-500/20 text-green-400 border-green-500/30" };
    if (score >= 70) return { label: "Good", classes: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    if (score >= 50) return { label: "Average", classes: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
    return { label: "Needs Improvement", classes: "bg-red-500/20 text-red-400 border-red-500/30" };
  };

  const badge = getScoreBadge(employee.performanceScore);

  return (
    <div className="card hover:border-slate-600 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar circle with initials */}
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-400 font-bold text-sm">
              {employee.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{employee.name}</h3>
            <p className="text-xs text-slate-400">{employee.email}</p>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => navigate(`/employees/edit/${employee._id}`)}
            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
            title="Edit Employee"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(employee._id, employee.name)}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Delete Employee"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Department & Badge */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="badge bg-slate-700 text-slate-300">{employee.department}</span>
        <span className={`badge border ${badge.classes}`}>{badge.label}</span>
      </div>

      {/* Performance Score Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Star className="w-3 h-3" />
            <span>Performance Score</span>
          </div>
          <span className="text-sm font-bold text-white">{employee.performanceScore}/100</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: `${employee.performanceScore}%`,
              background:
                employee.performanceScore >= 85
                  ? "#22c55e"
                  : employee.performanceScore >= 70
                  ? "#3b82f6"
                  : employee.performanceScore >= 50
                  ? "#eab308"
                  : "#ef4444",
            }}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-1.5">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {employee.skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="badge bg-slate-800 text-slate-300 border border-slate-600">
              {skill}
            </span>
          ))}
          {employee.skills.length > 4 && (
            <span className="badge bg-slate-800 text-slate-500">
              +{employee.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <span className="text-xs text-slate-500">
          {employee.yearsOfExperience} yrs experience
        </span>
        <button
          onClick={() => onAnalyze(employee)}
          className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          AI Analysis
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
