import axios from "axios";

// ── Base URL — reads from Vite env, falls back to localhost:5000 ──────────────
const BASE_URL = import.meta.env.VITE_API_URL || "https://househunt-backend-1syh.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request interceptor: attach JWT if stored ─────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("hh_token") ||
      sessionStorage.getItem("hh_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired / invalid — clear storage
      localStorage.removeItem("hh_token");
      localStorage.removeItem("hh_user");
      sessionStorage.removeItem("hh_token");
      sessionStorage.removeItem("hh_user");
      // Don't force redirect here; let the component handle it
    }
    return Promise.reject(error);
  }
);

export default api;
