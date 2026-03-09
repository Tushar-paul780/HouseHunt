const express = require("express");
const router  = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingsByUser,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

// All booking routes require authentication
router.use(protect);

// POST /api/bookings            — create a booking
// GET  /api/bookings/my         — current user's bookings
router.post("/", createBooking);
router.get("/my", getMyBookings);

// GET /api/bookings/user/:userId — bookings for a specific user (own or admin)
router.get("/user/:userId", getBookingsByUser);

// PUT /api/bookings/:id/cancel  — cancel a booking
router.put("/:id/cancel", cancelBooking);

module.exports = router;
