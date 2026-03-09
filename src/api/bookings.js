import api from "./client";

// ── POST /api/bookings ────────────────────────────────────────────────────────
export const createBooking = (data) => api.post("/bookings", data);

// ── GET /api/bookings/my ──────────────────────────────────────────────────────
export const getMyBookings = () => api.get("/bookings/my");

// ── GET /api/bookings/user/:userId ────────────────────────────────────────────
export const getBookingsByUser = (userId) =>
  api.get(`/bookings/user/${userId}`);

// ── PUT /api/bookings/:id/cancel ─────────────────────────────────────────────
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
