import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProperties, parsePriceRange, mapSort } from "../api/properties";
import { FiSearch, FiMapPin, FiChevronDown, FiX, FiGrid, FiList } from "react-icons/fi";

const propertyTypes = ["Any Type","House","Apartment","Villa","Studio","Loft","Townhouse","Cabin"];
const priceRanges   = ["Any Price","Under $500K","$500K–$1M","$1M–$2M","$2M–$5M","$5M+"];
const bedroomOpts   = ["Any Beds","1","2","3","4","5+"];
const statusOpts    = ["All","For Sale","For Rent"];
const sortOpts      = ["Newest","Price: Low→High","Price: High→Low","Most Beds"];
const PAGE_SIZE     = 12;

// Normalise MongoDB property shape → what PropertyCard/ListCard expect
const norm = (p) => ({
  ...p,
  id:      p._id,
  beds:    p.bedrooms,
  baths:   p.bathrooms,
  address: p.location,
  type:    p.propertyType,
  image:   p.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  price:   p.formattedPrice || `$${Number(p.price).toLocaleString()}`,
});

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [location,   setLocation]   = useState(searchParams.get("location") || "");
  const [propType,   setPropType]   = useState(searchParams.get("type")     || "Any Type");
  const [priceRange, setPriceRange] = useState(searchParams.get("price")    || "Any Price");
  const [beds,       setBeds]       = useState(searchParams.get("beds")     || "Any Beds");
  const [status,     setStatus]     = useState(searchParams.get("status")   || "All");
  const [sort,       setSort]       = useState("Newest");
  const [view,       setView]       = useState("grid");

  const [properties, setProperties] = useState([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [loadingMore,setLoadingMore]= useState(false);

  // Build API params from current filter state
  const buildParams = useCallback((pageNum = 1) => ({
    page: pageNum,
    limit: PAGE_SIZE,
    sort: mapSort(sort),
    ...(location && { location }),
    ...(status !== "All" && { status }),
    ...(propType !== "Any Type" && { propertyType: propType }),
    ...(beds !== "Any Beds" && { bedrooms: beds }),
    ...parsePriceRange(priceRange),
  }), [location, status, propType, beds, priceRange, sort]);

  const fetchProps = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true); else setLoadingMore(true);
      const { data } = await getProperties(buildParams(pageNum));
      const normalised = data.properties.map(norm);
      setProperties(prev => append ? [...prev, ...normalised] : normalised);
      setTotal(data.total);
    } catch (err) {
      console.error("SearchResults fetch error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [buildParams]);

  // Re-fetch whenever filters/sort change (reset to page 1)
  useEffect(() => {
    setPage(1);
    fetchProps(1, false);
  }, [location, status, propType, beds, priceRange, sort]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location)                 params.set("location", location);
    if (propType !== "Any Type")  params.set("type", propType);
    if (priceRange !== "Any Price") params.set("price", priceRange);
    if (beds !== "Any Beds")      params.set("beds", beds);
    if (status !== "All")         params.set("status", status);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setLocation(""); setPropType("Any Type"); setPriceRange("Any Price");
    setBeds("Any Beds"); setStatus("All"); setSearchParams({});
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchProps(next, true);
  };

  const activeFilters = [
    location     && { label: location,         clear: () => setLocation("") },
    propType  !== "Any Type"   && { label: propType,          clear: () => setPropType("Any Type") },
    priceRange !== "Any Price" && { label: priceRange,         clear: () => setPriceRange("Any Price") },
    beds      !== "Any Beds"   && { label: `${beds} Beds`,     clear: () => setBeds("Any Beds") },
    status    !== "All"        && { label: status,             clear: () => setStatus("All") },
  ].filter(Boolean);

  const hasMore = properties.length < total;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Search hero bar */}
      <div className="bg-slate-900 pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl font-bold text-white mb-4">Search Properties</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
              <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="City, neighbourhood…"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl text-sm focus:outline-none focus:border-brand-400 transition-all" />
            </div>
            {[
              [statusOpts,     status,     setStatus],
              [propertyTypes,  propType,   setPropType],
              [priceRanges,    priceRange, setPriceRange],
              [bedroomOpts,    beds,       setBeds],
            ].map(([opts, val, setter], i) => (
              <div key={i} className="relative">
                <select value={val} onChange={e => setter(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm appearance-none pr-8 focus:outline-none focus:border-brand-400 cursor-pointer">
                  {opts.map(o => <option key={o} value={o} className="text-slate-900 bg-white">{o}</option>)}
                </select>
                <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none text-xs" />
              </div>
            ))}
            <button onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95 shrink-0">
              <FiSearch /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Results area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            {loading ? (
              <p className="text-slate-500 text-sm">Loading properties…</p>
            ) : (
              <p className="text-slate-700 font-medium">
                <span className="font-bold text-slate-900 text-lg">{total}</span> properties found
                {location && <span className="text-slate-500"> in <span className="text-brand-500 font-semibold">{location}</span></span>}
              </p>
            )}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {activeFilters.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-700 text-xs font-medium px-3 py-1 rounded-full">
                    {f.label}
                    <button onClick={f.clear} className="hover:text-brand-900"><FiX className="text-xs" /></button>
                  </span>
                ))}
                <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-red-500 transition-colors underline">Clear all</button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="border border-slate-200 bg-white text-slate-700 rounded-xl px-4 py-2.5 text-sm appearance-none pr-8 focus:outline-none focus:border-brand-400 cursor-pointer shadow-sm">
                {sortOpts.map(s => <option key={s}>{s}</option>)}
              </select>
              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
            </div>
            <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {[["grid",FiGrid],["list",FiList]].map(([v, Icon]) => (
                <button key={v} onClick={() => setView(v)}
                  className={`p-2.5 transition-colors ${view === v ? "bg-brand-500 text-white" : "text-slate-400 hover:text-slate-600"}`}>
                  <Icon />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
                <div className="bg-slate-200 aspect-[4/3]" />
                <div className="p-5 space-y-3">
                  <div className="bg-slate-200 h-3 rounded w-1/3" />
                  <div className="bg-slate-200 h-5 rounded w-3/4" />
                  <div className="bg-slate-200 h-3 rounded w-1/2" />
                  <div className="bg-slate-100 h-10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="text-slate-400 text-3xl" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-700 mb-2">No properties found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
          </div>
        ) : (
          <>
            <div className={view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              : "flex flex-col gap-4"}>
              {properties.map(p => view === "grid"
                ? <PropertyCard key={p._id} property={p} />
                : <ListPropertyCard key={p._id} property={p} />
              )}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-10">
                <button onClick={handleLoadMore} disabled={loadingMore}
                  className="btn-outline inline-flex items-center gap-2 disabled:opacity-50">
                  {loadingMore
                    ? <><span className="w-4 h-4 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" /> Loading…</>
                    : <>Load More <span className="bg-brand-100 text-brand-600 text-xs font-bold px-2 py-0.5 rounded-full">+{Math.min(PAGE_SIZE, total - properties.length)}</span></>
                  }
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

// List-view card (horizontal layout)
function ListPropertyCard({ property }) {
  const navigate = useNavigate();
  const { _id, id, title, type, status, price, address, beds, baths, area, image, tag, description } = property;
  const propId = _id || id;
  return (
    <div onClick={() => navigate(`/property/${propId}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden flex cursor-pointer group transition-all hover:-translate-y-0.5">
      <div className="relative w-56 flex-shrink-0 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className={`absolute top-3 left-3 text-white text-xs font-semibold px-2.5 py-1 rounded-full ${status === "For Rent" ? "bg-sky-500" : "bg-emerald-500"}`}>{status}</span>
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <span className="text-brand-500 text-xs font-semibold uppercase tracking-widest">{type}</span>
            {tag && <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full">{tag}</span>}
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-500 transition-colors mb-1">{title}</h3>
          <p className="text-slate-500 text-sm flex items-center gap-1 mb-2">
            <FiMapPin className="text-brand-400 flex-shrink-0 text-xs" />{address}
          </p>
          <p className="text-slate-500 text-sm line-clamp-2">{description}</p>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="flex gap-4 text-sm text-slate-600">
            <span>{beds} Beds</span><span>{baths} Baths</span>
            <span>{Number(area).toLocaleString()} ft²</span>
          </div>
          <span className="font-bold text-slate-900 text-lg">{price}</span>
        </div>
      </div>
    </div>
  );
}
