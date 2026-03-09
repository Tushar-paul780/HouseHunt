import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { getProperties } from "../api/properties";
import { FiArrowRight, FiLoader } from "react-icons/fi";

const filters = ["All","For Sale","For Rent","Villa","Apartment","House","Studio","Loft"];
const PAGE_SIZE = 8;

// Map filter chips → API params
const filterToParams = (f) => {
  if (f === "For Sale" || f === "For Rent") return { status: f };
  if (f !== "All") return { propertyType: f };
  return {};
};

export default function FeaturedProperties() {
  const navigate = useNavigate();
  const [active,      setActive]      = useState("All");
  const [properties,  setProperties]  = useState([]);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProps = async (filter, pageNum, append = false) => {
    try {
      if (pageNum === 1) setLoading(true); else setLoadingMore(true);
      const params = { ...filterToParams(filter), page: pageNum, limit: PAGE_SIZE, sort: "newest" };
      const { data } = await getProperties(params);
      if (append) {
        setProperties(prev => [...prev, ...data.properties]);
      } else {
        setProperties(data.properties);
      }
      setTotal(data.total);
    } catch (err) {
      console.error("FeaturedProperties fetch error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProps(active, 1, false);
  }, [active]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchProps(active, next, true);
  };

  const hasMore = properties.length < total;

  // Normalise API property shape to match card expectations
  const normalise = (p) => ({
    ...p,
    beds:    p.bedrooms,
    baths:   p.bathrooms,
    address: p.location,
    type:    p.propertyType,
    image:   p.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    price:   p.formattedPrice || p.price,
  });

  return (
    <section id="properties" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-brand-500 text-sm font-semibold uppercase tracking-widest">Handpicked for you</span>
            <h2 className="section-heading mt-2">Featured Properties</h2>
            <p className="text-slate-500 mt-2 max-w-lg">Explore our curated selection of premium properties across the globe.</p>
          </div>
          <button onClick={()=>navigate("/search")} className="inline-flex items-center gap-2 text-brand-500 font-semibold hover:gap-3 transition-all text-sm shrink-0">
            View all listings <FiArrowRight />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(f=>(
            <button key={f} onClick={()=>setActive(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${active===f?"bg-brand-500 text-white border-brand-500 shadow-md":"bg-white text-slate-600 border-slate-200 hover:border-brand-400 hover:text-brand-500"}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({length:8}).map((_,i) => (
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
          <div className="text-center py-16 text-slate-400">No properties found for this filter.</div>
        ) : (
          <>
            <p className="text-slate-500 text-sm mb-5">
              Showing <span className="font-semibold text-slate-700">{properties.length}</span> of <span className="font-semibold text-slate-700">{total}</span> properties
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map(p => <PropertyCard key={p._id} property={normalise(p)} />)}
            </div>
          </>
        )}

        {hasMore && !loading && (
          <div className="text-center mt-12">
            <button onClick={handleLoadMore} disabled={loadingMore}
              className="btn-outline inline-flex items-center gap-2 disabled:opacity-50">
              {loadingMore ? <><span className="w-4 h-4 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" /> Loading...</> : (
                <>Load More Properties <span className="bg-brand-100 text-brand-600 text-xs font-bold px-2 py-0.5 rounded-full">+{Math.min(PAGE_SIZE, total - properties.length)}</span></>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
