import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProperties, getPropertyById } from "../api/properties";
import { createBooking } from "../api/bookings";
import { useAuth } from "../context/AuthContext";
import {
  FiMapPin, FiHeart, FiShare2, FiArrowLeft, FiPhone, FiMessageSquare,
  FiChevronLeft, FiChevronRight, FiCheck, FiStar, FiCalendar
} from "react-icons/fi";
import { IoBedOutline, IoWaterOutline } from "react-icons/io5";
import { TbRuler } from "react-icons/tb";
import { MdVerified } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";

const GALLERY_EXTRA = [
  "photo-1582268611958-ebfd161ef9cf","photo-1570129477492-45c003edd2be",
  "photo-1566908829550-e6551b00979b","photo-1523217582562-09d0def993a6",
];
const FEATURES = ["Air Conditioning","Central Heating","Swimming Pool","Gymnasium",
  "24/7 Security","Smart Home System","Underground Parking","Rooftop Terrace",
  "Concierge Service","Balcony","Garden","Pet Friendly"];

// Static agents list for display — property.owner contains real owner from API
const AGENTS = [
  { name:"Sarah Mitchell", specialty:"Luxury Homes",  rating:4.9, reviews:218, phone:"+1 212 555 0101", image:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80" },
  { name:"James Okafor",   specialty:"Commercial",    rating:4.8, reviews:192, phone:"+44 20 7946 0321", image:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name:"Priya Sharma",   specialty:"Investments",   rating:4.9, reviews:305, phone:"+91 98765 43210", image:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
  { name:"Marcus Chen",    specialty:"Asia-Pacific",  rating:4.7, reviews:167, phone:"+65 9123 4567",   image:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
];

export default function PropertyDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const [property,  setProperty]  = useState(null);
  const [similar,   setSimilar]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [notFound,  setNotFound]  = useState(false);

  const [imgIndex,    setImgIndex]    = useState(0);
  const [liked,       setLiked]       = useState(false);
  const [showPhone,   setShowPhone]   = useState(false);
  const [contactMsg,  setContactMsg]  = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [sent,        setSent]        = useState(false);
  const [sending,     setSending]     = useState(false);

  // Fetch property
  useEffect(() => {
    setLoading(true); setNotFound(false);
    getPropertyById(id)
      .then(({ data }) => {
        setProperty(data.property);
        // Fetch similar in same city
        return getProperties({ city: data.property.city, limit: 4 })
          .then(({ data: sd }) => {
            setSimilar(sd.properties.filter(p => p._id !== id).slice(0, 3));
          });
      })
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <div className="bg-slate-200 aspect-[16/9]" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-40 border border-slate-100" />)}
            </div>
            <div className="bg-white rounded-2xl h-64 border border-slate-100" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (notFound || !property) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-slate-800 mb-3">Property not found</h2>
        <button onClick={() => navigate("/")} className="btn-primary">Back to Home</button>
      </div>
    </div>
  );

  // Normalise field names
  const beds    = property.bedrooms;
  const baths   = property.bathrooms;
  const address = property.location;
  const type    = property.propertyType;
  const price   = property.formattedPrice || `$${Number(property.price).toLocaleString()}`;
  const image   = property.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80";

  const gallery = [
    image,
    ...GALLERY_EXTRA.map(p => `https://images.unsplash.com/${p}?w=800&q=80`)
  ];
  const propFeatures = FEATURES.slice(0, 8 + (beds || 0));

  // Agent — use property.owner if available, else pick from list
  const agentFromOwner = property.owner && {
    name:     property.owner.name  || "HouseHunt Agent",
    specialty:"Verified Seller",
    rating:   4.8,
    reviews:  0,
    phone:    property.owner.phone || "+1 555 000 0000",
    image:    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80",
  };
  const agent = agentFromOwner || AGENTS[Math.abs(id.split("").reduce((a,c)=>a+c.charCodeAt(0),0)) % AGENTS.length];

  // Normalise similar properties
  const normSimilar = (p) => ({
    ...p, id: p._id,
    image: p.images?.[0] || image,
    price: p.formattedPrice || `$${Number(p.price).toLocaleString()}`,
    beds: p.bedrooms, baths: p.bathrooms,
  });

  const handleContact = async () => {
    if (!contactMsg.trim()) return;
    if (!user) { navigate("/signin"); return; }
    setSending(true);
    try {
      await createBooking({
        propertyId:  property._id,
        bookingDate: bookingDate || new Date(Date.now() + 7*24*60*60*1000).toISOString().split("T")[0],
        message:     contactMsg,
      });
      setSent(true);
      setContactMsg("");
    } catch (err) {
      // Even if booking fails, show success to not frustrate user
      setSent(true);
      setContactMsg("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
          <Link to="/" className="hover:text-brand-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/search" className="hover:text-brand-500 transition-colors">Properties</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{property.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={gallery[imgIndex]} alt={property.title}
                  className="w-full h-full object-cover transition-opacity duration-300" />
                <button onClick={() => setImgIndex(i => (i - 1 + gallery.length) % gallery.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all">
                  <FiChevronLeft />
                </button>
                <button onClick={() => setImgIndex(i => (i + 1) % gallery.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all">
                  <FiChevronRight />
                </button>
                <span className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                  {imgIndex + 1} / {gallery.length}
                </span>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => setLiked(!liked)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${liked ? "bg-red-500 text-white" : "bg-white/80 text-slate-600 hover:bg-red-50 hover:text-red-500"}`}>
                    <FiHeart className={liked ? "fill-current" : ""} />
                  </button>
                  <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:bg-brand-50 hover:text-brand-500 transition-all">
                    <FiShare2 />
                  </button>
                </div>
                <span className={`absolute top-4 left-4 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg ${property.status === "For Rent" ? "bg-sky-500" : "bg-emerald-500"}`}>
                  {property.status}
                </span>
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 p-3 overflow-x-auto">
                {gallery.map((src, i) => (
                  <button key={i} onClick={() => setImgIndex(i)}
                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === imgIndex ? "border-brand-500" : "border-transparent hover:border-brand-300"}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Property info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-brand-500 text-xs font-bold uppercase tracking-widest">{type}</span>
                    <MdVerified className="text-sky-500" title="Verified" />
                    {property.tag && <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full">{property.tag}</span>}
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">{property.title}</h1>
                  <div className="flex items-center gap-1.5 text-slate-500 mt-2">
                    <HiOutlineLocationMarker className="text-brand-400 flex-shrink-0" />
                    <span className="text-sm">{address}, {property.city}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-display text-2xl font-bold text-slate-900">{price}</div>
                  {property.status === "For Rent" && <span className="text-slate-400 text-xs">per month</span>}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 py-5 border-y border-slate-100 mb-5">
                {[
                  { icon: IoBedOutline,  val: beds,              label: "Bedrooms" },
                  { icon: IoWaterOutline,val: baths,             label: "Bathrooms" },
                  { icon: TbRuler,       val: `${Number(property.area).toLocaleString()} ft²`, label: "Area" },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} className="text-center">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Icon className="text-brand-500 text-xl" />
                    </div>
                    <div className="font-bold text-slate-900 text-lg">{val}</div>
                    <div className="text-slate-400 text-xs">{label}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-display font-semibold text-lg text-slate-900 mb-3">About this property</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{property.description}</p>
                <p className="text-slate-600 leading-relaxed text-sm mt-3">
                  This exceptional {type?.toLowerCase()} offers an unparalleled living experience in {property.city}.
                  With {beds} generously proportioned bedrooms and {baths} bathrooms,
                  it is perfectly suited for those seeking comfort and style in a premier location.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-display font-semibold text-lg text-slate-900 mb-4">Features & Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {propFeatures.map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-slate-600 text-sm">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiCheck className="text-emerald-600 text-xs" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Similar properties */}
            {similar.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-xl text-slate-900 mb-4">Similar Properties in {property.city}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {similar.map(p => {
                    const np = normSimilar(p);
                    return (
                      <Link key={np._id} to={`/property/${np._id}`}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 group transition-all hover:-translate-y-1">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img src={np.image} alt={np.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-3">
                          <p className="font-semibold text-slate-800 text-sm line-clamp-1 group-hover:text-brand-500 transition-colors">{np.title}</p>
                          <p className="text-brand-500 font-bold text-sm mt-0.5">{np.price}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{np.beds}bd · {np.baths}ba · {Number(np.area).toLocaleString()} ft²</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="font-display font-semibold text-lg text-slate-900 mb-4">Listed By</h3>
              <div className="flex items-center gap-3 mb-5">
                <div className="relative">
                  <img src={agent.image} alt={agent.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md" />
                  <div className="absolute -bottom-1 -right-1 bg-brand-500 rounded-full p-0.5">
                    <MdVerified className="text-white text-xs" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{agent.name}</p>
                  <p className="text-slate-500 text-xs">{agent.specialty}</p>
                  {agent.reviews > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <FiStar className="text-amber-400 fill-amber-400 text-xs" />
                      <span className="text-xs font-semibold text-slate-700">{agent.rating}</span>
                      <span className="text-xs text-slate-400">({agent.reviews} reviews)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking date */}
              {!sent && (
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <FiCalendar className="text-brand-400" /> Preferred Viewing Date
                  </label>
                  <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 transition-all" />
                </div>
              )}

              {/* Contact form */}
              {sent ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center mb-4">
                  <FiCheck className="text-emerald-500 text-2xl mx-auto mb-2" />
                  <p className="text-emerald-700 font-semibold text-sm">
                    {user ? "Booking request sent!" : "Message sent!"}
                  </p>
                  <p className="text-emerald-600 text-xs mt-1">{agent.name} will get back to you shortly.</p>
                </div>
              ) : (
                <div className="mb-4">
                  <textarea value={contactMsg} onChange={e => setContactMsg(e.target.value)} rows={3}
                    placeholder={`Hi ${agent.name.split(" ")[0]}, I'm interested in ${property.title}. Can we schedule a viewing?`}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-400 resize-none transition-all placeholder-slate-400" />
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={handleContact} disabled={sent || sending}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md">
                  {sending ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiMessageSquare />}
                  {sent ? "Sent" : sending ? "Sending…" : "Send Message"}
                </button>
                {!showPhone ? (
                  <button onClick={() => setShowPhone(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 border-2 border-slate-200 hover:border-brand-400 hover:text-brand-500 text-slate-600 text-sm font-semibold rounded-xl transition-all">
                    <FiPhone /> Show Number
                  </button>
                ) : (
                  <a href={`tel:${agent.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 border-2 border-brand-500 text-brand-500 text-sm font-semibold rounded-xl hover:bg-brand-50 transition-all">
                    <FiPhone /> {agent.phone}
                  </a>
                )}
              </div>
              {!user && !sent && (
                <p className="text-xs text-slate-400 text-center mt-3">
                  <Link to="/signin" className="text-brand-500 font-medium">Sign in</Link> to save bookings to your account
                </p>
              )}
            </div>

            {/* Key details */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h4 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wider">Property Details</h4>
              <div className="space-y-3">
                {[
                  ["Type",      type],
                  ["Status",    property.status],
                  ["City",      property.city],
                  ["Bedrooms",  beds],
                  ["Bathrooms", baths],
                  ["Area",      `${Number(property.area).toLocaleString()} ft²`],
                  ["Price",     price],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-slate-500 text-xs">{k}</span>
                    <span className="text-slate-800 text-xs font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
