const Property = require("../models/Property");

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/properties
// @access  Public
// Query params: location, city, status, propertyType, minPrice, maxPrice,
//               bedrooms, page, limit, sort, search
// ─────────────────────────────────────────────────────────────────────────────
const getProperties = async (req, res) => {
  try {
    const {
      location,
      city,
      status,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      search,
      sort     = "newest",
      page     = 1,
      limit    = 12,
      featured,
    } = req.query;

    const filter = { isActive: true };

    // ── Free-text search across title / description / city ──────────────────
    if (search) {
      filter.$text = { $search: search };
    }

    // ── Location / city ─────────────────────────────────────────────────────
    if (city) {
      filter.city = { $regex: city, $options: "i" };
    } else if (location) {
      filter.$or = [
        { city:     { $regex: location, $options: "i" } },
        { location: { $regex: location, $options: "i" } },
      ];
    }

    // ── Status ───────────────────────────────────────────────────────────────
    if (status && status !== "All") {
      filter.status = status; // "For Sale" | "For Rent"
    }

    // ── Property type ────────────────────────────────────────────────────────
    if (propertyType && propertyType !== "Any Type") {
      filter.propertyType = propertyType;
    }

    // ── Price range ──────────────────────────────────────────────────────────
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // ── Bedrooms ─────────────────────────────────────────────────────────────
    if (bedrooms && bedrooms !== "Any Beds") {
      if (bedrooms === "5+") {
        filter.bedrooms = { $gte: 5 };
      } else {
        filter.bedrooms = Number(bedrooms);
      }
    }

    // ── Featured ─────────────────────────────────────────────────────────────
    if (featured === "true") {
      filter.featured = true;
    }

    // ── Sort ─────────────────────────────────────────────────────────────────
    const sortMap = {
      newest:     { createdAt: -1 },
      oldest:     { createdAt:  1 },
      "price-asc":  { price:  1 },
      "price-desc": { price: -1 },
      beds:       { bedrooms: -1 },
    };
    const sortObj = sortMap[sort] || { createdAt: -1 };

    // ── Pagination ────────────────────────────────────────────────────────────
    const pageNum  = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("owner", "name email phone")
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Property.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count:   properties.length,
      total,
      page:    pageNum,
      pages:   Math.ceil(total / limitNum),
      properties,
    });
  } catch (err) {
    console.error("getProperties error:", err);
    res.status(500).json({ success: false, message: "Server error fetching properties" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/properties/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("owner", "name email phone");

    if (!property || !property.isActive) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Increment view count (fire and forget)
    Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

    res.json({ success: true, property });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    console.error("getPropertyById error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/properties
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const createProperty = async (req, res) => {
  try {
    const {
      title, description, price, location, city,
      propertyType, bedrooms, bathrooms, area,
      images, status, tag,
    } = req.body;

    // Basic validation
    if (!title || !description || !price || !location || !city || !propertyType || !status) {
      return res.status(400).json({
        success: false,
        message: "title, description, price, location, city, propertyType and status are required",
      });
    }

    const property = await Property.create({
      title,
      description,
      price: Number(price),
      location,
      city,
      propertyType,
      bedrooms:  Number(bedrooms)  || 0,
      bathrooms: Number(bathrooms) || 0,
      area:      Number(area)      || 0,
      images:    Array.isArray(images) ? images : images ? [images] : [],
      status,
      tag:     tag || "New Listing",
      owner:   req.user._id,
    });

    res.status(201).json({ success: true, property });
  } catch (err) {
    console.error("createProperty error:", err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(". ") });
    }
    res.status(500).json({ success: false, message: "Server error creating property" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/properties/:id
// @access  Private  (owner or admin)
// ─────────────────────────────────────────────────────────────────────────────
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property || !property.isActive) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Ownership check
    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorised to update this property" });
    }

    const allowed = [
      "title","description","price","location","city","propertyType",
      "bedrooms","bathrooms","area","images","status","tag","featured","isActive",
    ];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) property[field] = req.body[field];
    });

    await property.save();
    res.json({ success: true, property });
  } catch (err) {
    console.error("updateProperty error:", err);
    res.status(500).json({ success: false, message: "Server error updating property" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/properties/:id
// @access  Private  (owner or admin)
// ─────────────────────────────────────────────────────────────────────────────
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorised to delete this property" });
    }

    // Soft delete
    property.isActive = false;
    await property.save();

    res.json({ success: true, message: "Property deleted successfully" });
  } catch (err) {
    console.error("deleteProperty error:", err);
    res.status(500).json({ success: false, message: "Server error deleting property" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/properties/my
// @access  Private — returns properties owned by logged-in user
// ─────────────────────────────────────────────────────────────────────────────
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id, isActive: true })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: properties.length, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
};
