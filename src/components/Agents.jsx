import { agents } from "../data/properties";
import { FiPhone, FiMessageSquare, FiStar } from "react-icons/fi";
import { HiOutlineBriefcase } from "react-icons/hi";
import { MdVerified } from "react-icons/md";

export default function Agents() {
  return (
    <section id="agents" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-brand-500 text-sm font-semibold uppercase tracking-widest">
            Meet The Team
          </span>
          <h2 className="section-heading mt-2">Our Expert Agents</h2>
          <p className="section-sub">
            Seasoned real estate professionals ready to guide you through every
            step of your journey.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="card card-lift group text-center overflow-visible"
            >
              {/* Photo */}
              <div className="relative mx-auto w-24 h-24 mt-6 mb-4">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-full h-full rounded-full object-cover ring-4 ring-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 bg-brand-500 rounded-full p-1">
                  <MdVerified className="text-white text-sm" />
                </div>
              </div>

              <div className="px-5 pb-5">
                {/* Name */}
                <h3 className="font-display text-lg font-semibold text-slate-900 leading-tight">
                  {agent.name}
                </h3>

                {/* Specialty */}
                <div className="flex items-center justify-center gap-1.5 mt-1 mb-3">
                  <HiOutlineBriefcase className="text-brand-400 text-sm" />
                  <span className="text-slate-500 text-sm">{agent.specialty}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-3">
                  <FiStar className="text-amber-400 fill-amber-400 text-sm" />
                  <span className="font-semibold text-slate-800 text-sm">
                    {agent.rating}
                  </span>
                  <span className="text-slate-400 text-xs">
                    ({agent.reviews} reviews)
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex justify-center gap-6 py-3 border-y border-slate-100 mb-4">
                  <div>
                    <div className="font-bold text-slate-900 text-lg">
                      {agent.listings}
                    </div>
                    <div className="text-slate-400 text-xs">Listings</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">
                      {agent.reviews}
                    </div>
                    <div className="text-slate-400 text-xs">Reviews</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-all shadow-sm hover:shadow-md">
                    <FiPhone className="text-sm" />
                    Call
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-2 border-slate-200 hover:border-brand-400 hover:text-brand-500 text-slate-600 rounded-xl transition-all">
                    <FiMessageSquare className="text-sm" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="btn-outline">
            View All Agents
          </button>
        </div>
      </div>
    </section>
  );
}
