import {
  HiOutlineBadgeCheck,
  HiOutlineUserGroup,
  HiOutlineSearch,
  HiOutlineLockClosed,
} from "react-icons/hi";
import { BsArrowUpRight } from "react-icons/bs";

const features = [
  {
    icon: HiOutlineBadgeCheck,
    color: "bg-emerald-50 text-emerald-600",
    ring: "ring-emerald-200",
    title: "Verified Listings",
    description:
      "Every property on our platform undergoes rigorous verification. You browse only authentic, legally-clear listings — no fake ads, ever.",
    stat: "100% Verified",
  },
  {
    icon: HiOutlineUserGroup,
    color: "bg-sky-50 text-sky-600",
    ring: "ring-sky-200",
    title: "Trusted Agents",
    description:
      "Our network of 9,000+ licensed agents is background-checked and rated by real buyers. Expect professional, transparent service every step.",
    stat: "9K+ Agents",
  },
  {
    icon: HiOutlineSearch,
    color: "bg-violet-50 text-violet-600",
    ring: "ring-violet-200",
    title: "Smart Search",
    description:
      "AI-powered filters help you find properties that match your lifestyle — by commute time, school district, neighborhood vibe, and more.",
    stat: "AI-Powered",
  },
  {
    icon: HiOutlineLockClosed,
    color: "bg-brand-50 text-brand-600",
    ring: "ring-brand-200",
    title: "Secure Transactions",
    description:
      "End-to-end encrypted document sharing, escrow-backed payments, and legal templates keep your transactions fully protected.",
    stat: "256-bit Encrypted",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why" className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left text */}
          <div>
            <span className="text-brand-500 text-sm font-semibold uppercase tracking-widest">
              Our Advantage
            </span>
            <h2 className="section-heading mt-2 mb-5">
              Why Thousands Choose{" "}
              <span className="text-brand-500">HouseHunt</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              We combine cutting-edge technology with deep real estate expertise
              to give you a homebuying experience that's faster, safer, and
              genuinely enjoyable.
            </p>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { n: "18K+", l: "Listings" },
                { n: "50+", l: "Cities" },
                { n: "4.9★", l: "App Rating" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100"
                >
                  <div className="font-display text-2xl font-bold text-slate-900">
                    {s.n}
                  </div>
                  <div className="text-slate-500 text-xs mt-1">{s.l}</div>
                </div>
              ))}
            </div>

            <button className="btn-primary inline-flex items-center gap-2">
              Start Exploring <BsArrowUpRight />
            </button>
          </div>

          {/* Right feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`w-12 h-12 ${f.color} ring-4 ${f.ring} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <f.icon className="text-2xl" />
                </div>
                <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">
                  {f.stat}
                </span>
                <h3 className="font-display text-lg font-semibold text-slate-900 mt-1 mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
