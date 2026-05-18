// src/context/AuthContext.jsx - Global Authentication State Management

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, restore user session from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("performai_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("performai_user");
      }
    }
    setLoading(false);
  }, []);

  // Save user data (including JWT token) to state and localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("performai_user", JSON.stringify(userData));
  };

  // Clear user session on logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("performai_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
