import api from "./client";

// ── POST /api/auth/register ───────────────────────────────────────────────────
export const registerUser = (data) => api.post("/auth/register", data);

// ── POST /api/auth/login ──────────────────────────────────────────────────────
export const loginUser = (data) => api.post("/auth/login", data);

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
export const getMe = () => api.get("/auth/me");

// ── PUT /api/auth/profile ─────────────────────────────────────────────────────
export const updateProfile = (data) => api.put("/auth/profile", data);
