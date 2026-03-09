import { useNavigate } from "react-router-dom";
import { locations } from "../data/properties";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";

export default function Locations() {
  const navigate = useNavigate();

  return (
    <section id="locations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-500 text-sm font-semibold uppercase tracking-widest">Explore Cities</span>
          <h2 className="section-heading mt-2">Popular Locations</h2>
          <p className="section-sub">Discover dream properties in the world's most sought-after cities.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
          {locations.map((loc, i) => (
            <div key={loc.id}
              onClick={()=>navigate(`/search?location=${encodeURIComponent(loc.city)}`)}
              className={`location-card relative rounded-2xl overflow-hidden cursor-pointer group ${i===0 ? "row-span-2" : ""}`}>
              <img src={loc.image} alt={loc.city} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent rounded-2xl" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-white font-bold text-lg leading-tight">{loc.city}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <HiOutlineLocationMarker className="text-brand-400 text-xs" />
                      <span className="text-white/70 text-xs">{loc.country}</span>
                    </div>
                    <span className="inline-block mt-1.5 text-xs text-brand-300 font-medium">
                      {loc.count} {loc.count === 1 ? "Property" : "Properties"}
                    </span>
                  </div>
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <FiArrowRight className="text-white text-sm" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-2 ring-brand-500/0 group-hover:ring-brand-500/50 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
