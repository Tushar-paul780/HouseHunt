import { Link } from "react-router-dom";
import { BsArrowUpRight, BsHouseDoor, BsGraphUpArrow } from "react-icons/bs";
import { HiOutlineLightningBolt } from "react-icons/hi";

export default function CTA() {
  return (
    <section id="cta" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1400&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-brand-900/60" />

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-brand-400/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center px-8 sm:px-12 lg:px-16 py-16">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-400/30 rounded-full px-4 py-1.5 mb-6">
                <HiOutlineLightningBolt className="text-brand-400" />
                <span className="text-brand-300 text-sm font-medium">
                  List in under 5 minutes
                </span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
                Ready to Sell or{" "}
                <span className="text-brand-400">List Your Property?</span>
              </h2>

              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                Reach millions of verified buyers and renters. Our smart listing
                tools, professional photography service, and expert agents get
                you the best price — fast.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/list-property" className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-brand-500/30 transition-all duration-200 active:scale-95">
                  <BsHouseDoor className="text-xl" />
                  List Your Property
                  <BsArrowUpRight />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right — info cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: BsGraphUpArrow,
                  stat: "3.2×",
                  label: "More Views",
                  sub: "Than competitor platforms",
                },
                {
                  icon: BsHouseDoor,
                  stat: "21 days",
                  label: "Avg. Time to Sell",
                  sub: "Industry avg: 45 days",
                },
                {
                  icon: HiOutlineLightningBolt,
                  stat: "Free",
                  label: "First Listing",
                  sub: "No credit card needed",
                },
                {
                  icon: BsGraphUpArrow,
                  stat: "97%",
                  label: "Seller Satisfaction",
                  sub: "Based on 12K+ reviews",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 hover:bg-white/15 transition-all"
                >
                  <item.icon className="text-brand-400 text-2xl mb-3" />
                  <div className="font-display text-2xl font-bold text-white">
                    {item.stat}
                  </div>
                  <div className="text-white/90 font-semibold text-sm mt-0.5">
                    {item.label}
                  </div>
                  <div className="text-white/50 text-xs mt-1">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
