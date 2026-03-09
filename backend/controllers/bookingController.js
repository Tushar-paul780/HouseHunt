const Booking  = require("../models/Booking");
const Property = require("../models/Property");

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/bookings
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const createBooking = async (req, res) => {
  try {
    const { propertyId, bookingDate, message, phone } = req.body;

    if (!propertyId || !bookingDate) {
      return res.status(400).json({
        success: false,
        message: "propertyId and bookingDate are required",
      });
    }

    // Verify property exists
    const property = await Property.findById(propertyId);
    if (!property || !property.isActive) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const booking = await Booking.create({
      user:        req.user._id,
      property:    propertyId,
      bookingDate: new Date(bookingDate),
      message:     message || "",
      phone:       phone   || req.user.phone || "",
    });

    await booking.populate([
      { path: "property", select: "title city location price status" },
      { path: "user",     select: "name email" },
    ]);

    res.status(201).json({ success: true, booking });
  } catch (err) {
    // Duplicate booking (same user + property + date)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You already have a booking for this property on that date",
      });
    }
    console.error("createBooking error:", err);
    res.status(500).json({ success: false, message: "Server error creating booking" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/bookings/my
// @access  Private — bookings by the logged-in user
// ─────────────────────────────────────────────────────────────────────────────
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("property", "title city location price status images")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/bookings/user/:userId
// @access  Private (own bookings) or Admin
// ─────────────────────────────────────────────────────────────────────────────
const getBookingsByUser = async (req, res) => {
  try {
    // Allow user to fetch only their own bookings, unless admin
    if (
      req.params.userId !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorised" });
    }

    const bookings = await Booking.find({ user: req.params.userId })
      .populate("property", "title city location price status images")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/bookings/:id/cancel
// @access  Private — cancel own booking
// ─────────────────────────────────────────────────────────────────────────────
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorised" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createBooking, getMyBookings, getBookingsByUser, cancelBooking };
