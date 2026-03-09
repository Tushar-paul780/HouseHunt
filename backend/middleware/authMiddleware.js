const jwt  = require("jsonwebtoken");
const User = require("../models/User");

// ── protect: require a valid JWT ─────────────────────────────────────────────
const protect = async (req, res, next) => {
  let token;

  // Accept token from Authorization header  OR  cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorised — no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach fresh user (without password) to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or account deactivated",
      });
    }

    next();
  } catch (err) {
    const msg =
      err.name === "TokenExpiredError"
        ? "Token expired — please log in again"
        : "Invalid token";
    return res.status(401).json({ success: false, message: msg });
  }
};

// ── optionalAuth: attach user if token present, but don't block ──────────────
const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch {
      // ignore invalid token in optional auth
    }
  }
  next();
};

// ── adminOnly: require role === 'admin' ──────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied — admin role required",
    });
  }
  next();
};

module.exports = { protect, optionalAuth, adminOnly };
