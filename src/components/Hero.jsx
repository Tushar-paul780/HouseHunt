import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiChevronDown } from "react-icons/fi";
import { HiOutlineHome } from "react-icons/hi";

const propertyTypes = ["Any Type","House","Apartment","Villa","Studio","Loft","Townhouse","Cabin"];
const priceRanges   = ["Any Price","Under $500K","$500K–$1M","$1M–$2M","$2M–$5M","$5M+"];
const bedroomOpts   = ["Any Beds","1","2","3","4","5+"];

const stats = [
  { value:"70+",  label:"Properties Listed" },
  { value:"4",    label:"Verified Agents" },
  { value:"15+",  label:"Cities Covered" },
  { value:"99%",  label:"Client Satisfaction" },
];

export default function Hero() {
  const navigate = useNavigate();
  const [activeTab,   setActiveTab]   = useState("Buy");
  const [location,    setLocation]    = useState("");
  const [propertyType,setPropertyType]= useState("Any Type");
  const [priceRange,  setPriceRange]  = useState("Any Price");
  const [bedrooms,    setBedrooms]    = useState("Any Beds");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (activeTab === "Buy")  params.set("status", "For Sale");
    if (activeTab === "Rent") params.set("status", "For Rent");
    if (location)             params.set("location", location);
    if (propertyType !== "Any Type")  params.set("type", propertyType);
    if (priceRange !== "Any Price")   params.set("price", priceRange);
    if (bedrooms !== "Any Beds")      params.set("beds", bedrooms);
    navigate(`/search?${params.toString()}`);
  };

  const handleQuick = (tag) => {
    const map = { "New York":"New York", "Dubai Villas":"Dubai", "London Flats":"London", "Mumbai":"Mumbai" };
    const params = new URLSearchParams();
    params.set("location", map[tag] || tag);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage:"url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=85')" }} />
      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-slate-900/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">70+ Verified Listings Available</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5">
            Find Your{" "}
            <span className="relative inline-block">
              <span className="text-brand-400">Perfect</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 10" fill="none">
                <path d="M0 8 Q100 0 200 8" stroke="#f97316" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
              </svg>
            </span>{" "}Home
          </h1>
          <p className="text-white/80 text-lg sm:text-xl font-light max-w-xl mb-10">
            Search from thousands of verified properties across the globe.
          </p>
        </div>

        {/* Search box */}
        <div className="glass rounded-2xl p-5 sm:p-6 max-w-4xl">
          <div className="flex gap-1 mb-5">
            {["Buy","Rent","Sell"].map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); if(tab==="Sell") navigate("/list-property"); }}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab===tab ? "bg-brand-500 text-white shadow-md" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative lg:col-span-2">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400 text-lg pointer-events-none" />
              <input type="text" placeholder="City or area" value={location} onChange={(e)=>setLocation(e.target.value)}
                onKeyDown={(e)=>e.key==="Enter"&&handleSearch()}
                className="w-full bg-white/20 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all" />
            </div>
            <div className="relative">
              <HiOutlineHome className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400 text-lg pointer-events-none" />
              <select value={propertyType} onChange={(e)=>setPropertyType(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-xl pl-10 pr-8 py-3.5 text-sm focus:outline-none focus:border-brand-400 appearance-none cursor-pointer">
                {propertyTypes.map(t=><option key={t} value={t} className="text-slate-900 bg-white">{t}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400 text-sm font-bold pointer-events-none">$</span>
              <select value={priceRange} onChange={(e)=>setPriceRange(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-xl pl-8 pr-8 py-3.5 text-sm focus:outline-none focus:border-brand-400 appearance-none cursor-pointer">
                {priceRanges.map(p=><option key={p} value={p} className="text-slate-900 bg-white">{p}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
            </div>
            <button onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-brand-500/30 transition-all active:scale-95">
              <FiSearch className="text-lg" /> Search
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-white/50 text-xs font-medium pt-0.5">Popular:</span>
            {["New York","Dubai Villas","London Flats","Mumbai"].map(tag=>(
              <button key={tag} onClick={()=>handleQuick(tag)}
                className="text-xs text-white/70 hover:text-brand-300 border border-white/20 hover:border-brand-400 rounded-full px-3 py-1 transition-all">
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 sm:gap-10 mt-12">
          {stats.map(stat=>(
            <div key={stat.label} className="text-white">
              <div className="font-display text-3xl font-bold text-brand-400">{stat.value}</div>
              <div className="text-white/60 text-sm mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60V30C240 0 480 60 720 30C960 0 1200 60 1440 30V60H0Z" fill="white"/></svg>
      </div>
    </section>
  );
}
