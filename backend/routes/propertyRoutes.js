const express = require("express");
const router  = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} = require("../controllers/propertyController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

// GET  /api/properties         — list with filters/pagination (public)
// POST /api/properties         — create new listing (auth required)
router
  .route("/")
  .get(optionalAuth, getProperties)
  .post(protect, createProperty);

// GET /api/properties/my       — listings by logged-in user (auth required)
router.get("/my", protect, getMyProperties);

// GET    /api/properties/:id   — single property (public)
// PUT    /api/properties/:id   — update (owner or admin)
// DELETE /api/properties/:id   — soft-delete (owner or admin)
router
  .route("/:id")
  .get(optionalAuth, getPropertyById)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

module.exports = router;
