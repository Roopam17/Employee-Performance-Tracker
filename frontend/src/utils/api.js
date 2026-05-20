// src/utils/api.js - Axios Instance with JWT Interceptor

import axios from "axios";

// Base URL from environment variable
const API_BASE_URL = "https://employee-performance-tracker-ke1j.onrender.com/api";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("performai_user");
    if (storedUser) {
      const { token } = JSON.parse(storedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout on token expiry
      localStorage.removeItem("performai_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
