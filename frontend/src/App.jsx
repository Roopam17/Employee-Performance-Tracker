// src/App.jsx - Main App Component with React Router Configuration

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import EmployeeListPage from "./pages/EmployeeListPage.jsx";
import AddEmployeePage from "./pages/AddEmployeePage.jsx";
import EditEmployeePage from "./pages/EditEmployeePage.jsx";
import AIRecommendationPage from "./pages/AIRecommendationPage.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

// Protected Route: redirects to /login if user is not authenticated
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route: redirects authenticated users away from login/signup
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes - wrapped in Layout (navbar + sidebar) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="employees" element={<EmployeeListPage />} />
        <Route path="employees/add" element={<AddEmployeePage />} />
        <Route path="employees/edit/:id" element={<EditEmployeePage />} />
        <Route path="ai-recommend" element={<AIRecommendationPage />} />
      </Route>

      {/* Catch-all: redirect unknown routes */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
