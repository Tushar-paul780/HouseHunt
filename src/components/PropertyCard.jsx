import { Link } from "react-router-dom";
import { FiMapPin, FiHeart } from "react-icons/fi";
import { IoBedOutline, IoWaterOutline } from "react-icons/io5";
import { TbRuler } from "react-icons/tb";
import { MdVerified } from "react-icons/md";

const statusColors = {
  "For Sale": "bg-emerald-500",
  "For Rent": "bg-sky-500",
};

export default function PropertyCard({ property }) {
  const { _id, id, title, type, status, price, address, beds, baths, area, image, tag } = property;
  const propId = _id || id;

  return (
    <Link to={`/property/${propId}`} className="card card-lift group cursor-pointer block">
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all duration-300" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`${statusColors[status] || "bg-brand-500"} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md`}>
            {status}
          </span>
          {tag && (
            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              {tag}
            </span>
          )}
        </div>
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 transition-all duration-200 group/heart opacity-0 group-hover:opacity-100"
        >
          <FiHeart className="text-slate-500 group-hover/heart:text-red-500 transition-colors" />
        </button>
        <div className="absolute bottom-3 left-3">
          <span className="bg-slate-900/85 backdrop-blur-sm text-white font-bold text-base px-4 py-1.5 rounded-xl shadow-lg">
            {price}
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-brand-500 text-xs font-semibold uppercase tracking-widest">{type}</span>
          <MdVerified className="text-sky-500" title="Verified listing" />
        </div>
        <h3 className="font-display text-lg font-semibold text-slate-900 leading-snug mb-2 group-hover:text-brand-500 transition-colors line-clamp-1">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
          <FiMapPin className="flex-shrink-0 text-brand-400" />
          <span className="truncate">{address}</span>
        </div>
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-600 text-sm">
              <IoBedOutline className="text-brand-400 text-base" />
              <span className="font-medium">{beds}</span>
              <span className="text-slate-400 text-xs">Beds</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 text-sm">
              <IoWaterOutline className="text-brand-400 text-base" />
              <span className="font-medium">{baths}</span>
              <span className="text-slate-400 text-xs">Baths</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 text-sm">
              <TbRuler className="text-brand-400 text-base" />
              <span className="font-medium">{area.toLocaleString()}</span>
              <span className="text-slate-400 text-xs">ft²</span>
            </div>
          </div>
        </div>
        <div className="mt-4 w-full py-2.5 text-sm font-semibold text-center text-brand-500 border-2 border-brand-200 hover:border-brand-500 hover:bg-brand-500 hover:text-white rounded-xl transition-all duration-200 group-hover:border-brand-500">
          View Details
        </div>
      </div>
    </Link>
  );
}
