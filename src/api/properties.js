import api from "./client";

// ── GET /api/properties  (with query params object) ───────────────────────────
// params: { location, city, status, propertyType, minPrice, maxPrice,
//           bedrooms, sort, page, limit, featured, search }
export const getProperties = (params = {}) =>
  api.get("/properties", { params });

// ── GET /api/properties/:id ───────────────────────────────────────────────────
export const getPropertyById = (id) => api.get(`/properties/${id}`);

// ── POST /api/properties  (auth required) ────────────────────────────────────
export const createProperty = (data) => api.post("/properties", data);

// ── PUT /api/properties/:id  (auth required) ─────────────────────────────────
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data);

// ── DELETE /api/properties/:id  (auth required) ──────────────────────────────
export const deleteProperty = (id) => api.delete(`/properties/${id}`);

// ── GET /api/properties/my  (auth required) ───────────────────────────────────
export const getMyProperties = () => api.get("/properties/my");

// ── Helper: convert frontend price-range string to API min/max params ─────────
export const parsePriceRange = (range) => {
  const map = {
    "Under $500K":  { maxPrice: 500000 },
    "$500K–$1M":    { minPrice: 500000,   maxPrice: 1000000 },
    "$1M–$2M":      { minPrice: 1000000,  maxPrice: 2000000 },
    "$2M–$5M":      { minPrice: 2000000,  maxPrice: 5000000 },
    "$5M+":         { minPrice: 5000000 },
  };
  return map[range] || {};
};

// ── Helper: map frontend sort label → API sort key ────────────────────────────
export const mapSort = (label) => {
  const map = {
    "Newest":           "newest",
    "Price: Low→High":  "price-asc",
    "Price: High→Low":  "price-desc",
    "Most Beds":        "beds",
  };
  return map[label] || "newest";
};
