const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
      minlength: [5,  "Title must be at least 5 characters"],
      maxlength: [150,"Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    location: {
      type: String,
      required: [true, "Location / address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    propertyType: {
      type: String,
      required: [true, "Property type is required"],
      enum: ["House","Apartment","Villa","Studio","Loft","Townhouse","Cabin","Penthouse","Other"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Number of bedrooms is required"],
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: [true, "Number of bathrooms is required"],
      min: 0,
    },
    area: {
      type: Number,           // square feet
      required: [true, "Area is required"],
      min: 1,
    },
    images: {
      type: [String],          // array of image URLs
      default: [],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["For Sale", "For Rent"],
    },
    tag: {
      type: String,
      default: "",
      maxlength: 40,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Text index for full-text search ─────────────────────────────────────────
propertySchema.index({ title: "text", description: "text", city: "text", location: "text" });

// ── Compound indexes for filter queries ──────────────────────────────────────
propertySchema.index({ city: 1, status: 1 });
propertySchema.index({ propertyType: 1, status: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ createdAt: -1 });

// ── Virtual: primary image helper ────────────────────────────────────────────
propertySchema.virtual("image").get(function () {
  return this.images && this.images.length > 0
    ? this.images[0]
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80";
});

// ── Virtual: formatted price ─────────────────────────────────────────────────
propertySchema.virtual("formattedPrice").get(function () {
  const n = this.price;
  const fmt = n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000
    ? `$${(n / 1_000).toFixed(0)}K`
    : `$${n}`;
  return this.status === "For Rent" ? `${fmt}/mo` : fmt;
});

module.exports = mongoose.model("Property", propertySchema);
