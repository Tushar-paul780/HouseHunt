import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { createProperty } from "../api/properties";
import {
  FiHome, FiMapPin, FiDollarSign, FiCamera, FiCheck,
  FiAlertCircle, FiArrowRight
} from "react-icons/fi";
import { IoBedOutline, IoWaterOutline } from "react-icons/io5";
import { TbRuler } from "react-icons/tb";

const propertyTypes = ["House","Apartment","Villa","Studio","Loft","Townhouse","Cabin","Penthouse"];
const cities        = ["Mumbai","Delhi","Bangalore","Kolkata","Dubai","London","New York","Singapore","Los Angeles","Miami","Sydney","Paris","Aspen","Other"];

export default function ListProperty() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [form, setForm] = useState({
    title:"", type:"Apartment", listingType:"For Rent",
    price:"", city:"", address:"", bedrooms:"1", bathrooms:"1",
    area:"", description:"", imageUrl:"",
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(null);
  const [apiError,setApiError]= useState("");

  const validate = () => {
    const e = {};
    if (!form.title.trim())                       e.title       = "Property title is required";
    if (!form.price)                              e.price       = "Price is required";
    else if (isNaN(+form.price.replace(/,/g,""))) e.price       = "Enter a valid number";
    if (!form.city)                               e.city        = "City is required";
    if (!form.address.trim())                     e.address     = "Address is required";
    if (!form.area)                               e.area        = "Area is required";
    else if (isNaN(+form.area))                   e.area        = "Enter a valid number";
    if (form.description.trim().length < 20)      e.description = "Please add at least 20 characters";
    return e;
  };

  const update = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
  };

  const handleImageUrl = (url) => {
    update("imageUrl", url);
    if (url.startsWith("http")) setPreview(url);
    else setPreview(null);
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setApiError("");

    try {
      const rawPrice = +form.price.replace(/,/g, "");
      await createProperty({
        title:        form.title,
        propertyType: form.type,
        status:       form.listingType,
        price:        rawPrice,
        location:     form.address,
        city:         form.city,
        bedrooms:     parseInt(form.bedrooms) || 1,
        bathrooms:    parseInt(form.bathrooms) || 1,
        area:         parseInt(form.area),
        description:  form.description,
        images:       preview ? [preview] : [],
        tag:          "New Listing",
      });
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to list property. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Not logged in ─────────────────────────────────────────────────────────────
  if (!user) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiAlertCircle className="text-brand-500 text-3xl" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">Sign in required</h2>
          <p className="text-slate-500 mb-6">You need to be signed in to list a property.</p>
          <div className="flex gap-3">
            <Link to="/signin" className="flex-1 btn-primary text-center text-sm">Sign In</Link>
            <Link to="/signup" className="flex-1 btn-outline text-center text-sm">Create Account</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  // ── Success screen ────────────────────────────────────────────────────────────
  if (success) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-50">
            <FiCheck className="text-emerald-500 text-4xl" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">Property Listed!</h2>
          <p className="text-slate-500 mb-2">Your property <strong className="text-slate-700">"{form.title}"</strong> has been listed successfully.</p>
          <p className="text-slate-400 text-sm mb-8">It will appear in search results immediately.</p>
          <div className="flex gap-3">
            <button onClick={() => navigate("/search")} className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm">
              View Listings <FiArrowRight />
            </button>
            <button onClick={() => {
              setSuccess(false);
              setForm({title:"",type:"Apartment",listingType:"For Rent",price:"",city:"",address:"",bedrooms:"1",bathrooms:"1",area:"",description:"",imageUrl:""});
              setPreview(null);
            }} className="flex-1 btn-outline text-sm">List Another</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  // ── Main form ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="mb-8">
          <span className="text-brand-500 text-sm font-semibold uppercase tracking-widest">Property Listing</span>
          <h1 className="font-display text-3xl font-bold text-slate-900 mt-1">List Your Property</h1>
          <p className="text-slate-500 mt-2">Fill in the details below to list your property on HouseHunt.</p>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-3.5 text-sm mb-6 flex items-start gap-2">
            <FiAlertCircle className="flex-shrink-0 mt-0.5" />
            {apiError}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 px-8 py-4">
            <div className="flex items-center gap-3">
              {["Property Info","Location","Media & Description"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  {i > 0 && <div className="w-8 h-px bg-slate-200" />}
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{i+1}</div>
                    <span className="text-xs font-medium text-slate-600 hidden sm:block">{s}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Section 1: Property Info */}
            <div>
              <h2 className="font-display font-semibold text-xl text-slate-900 mb-5 flex items-center gap-2">
                <FiHome className="text-brand-500" /> Property Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Property Title *</label>
                  <input value={form.title} onChange={e => update("title", e.target.value)}
                    placeholder="e.g. Modern 3-Bed Apartment in Downtown"
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all ${errors.title ? "border-red-400 bg-red-50" : "border-slate-200"}`} />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Property Type *</label>
                  <select value={form.type} onChange={e => update("type", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 appearance-none cursor-pointer">
                    {propertyTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                {/* Listing type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Listing Type *</label>
                  <div className="flex gap-2">
                    {["For Rent","For Sale"].map(t => (
                      <button key={t} onClick={() => update("listingType", t)}
                        className={`flex-1 py-3 text-sm font-semibold rounded-xl border-2 transition-all ${form.listingType === t ? "bg-brand-500 border-brand-500 text-white shadow-md" : "border-slate-200 text-slate-600 hover:border-brand-400"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Price * {form.listingType === "For Rent" && <span className="text-slate-400 font-normal">(per month)</span>}
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={form.price} onChange={e => update("price", e.target.value)} placeholder="e.g. 2500"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all ${errors.price ? "border-red-400 bg-red-50" : "border-slate-200"}`} />
                  </div>
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Area (sq ft) *</label>
                  <div className="relative">
                    <TbRuler className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="number" value={form.area} onChange={e => update("area", e.target.value)} placeholder="e.g. 1200"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all ${errors.area ? "border-red-400 bg-red-50" : "border-slate-200"}`} />
                  </div>
                  {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bedrooms *</label>
                  <div className="flex items-center gap-3">
                    <IoBedOutline className="text-brand-400 text-xl flex-shrink-0" />
                    <div className="flex border border-slate-200 rounded-xl overflow-hidden flex-1">
                      {["1","2","3","4","5","6+"].map(n => (
                        <button key={n} onClick={() => update("bedrooms", n)}
                          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${form.bedrooms === n ? "bg-brand-500 text-white" : "text-slate-500 hover:bg-brand-50 hover:text-brand-500"}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bathrooms *</label>
                  <div className="flex items-center gap-3">
                    <IoWaterOutline className="text-brand-400 text-xl flex-shrink-0" />
                    <div className="flex border border-slate-200 rounded-xl overflow-hidden flex-1">
                      {["1","2","3","4","5+"].map(n => (
                        <button key={n} onClick={() => update("bathrooms", n)}
                          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${form.bathrooms === n ? "bg-brand-500 text-white" : "text-slate-500 hover:bg-brand-50 hover:text-brand-500"}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Location */}
            <div className="border-t border-slate-100 pt-8">
              <h2 className="font-display font-semibold text-xl text-slate-900 mb-5 flex items-center gap-2">
                <FiMapPin className="text-brand-500" /> Location
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">City *</label>
                  <select value={form.city} onChange={e => update("city", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 appearance-none cursor-pointer ${errors.city ? "border-red-400 bg-red-50" : "border-slate-200"}`}>
                    <option value="">Select a city</option>
                    {cities.map(c => <option key={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Address *</label>
                  <input value={form.address} onChange={e => update("address", e.target.value)}
                    placeholder="Street, neighbourhood, zip code"
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all ${errors.address ? "border-red-400 bg-red-50" : "border-slate-200"}`} />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Media */}
            <div className="border-t border-slate-100 pt-8">
              <h2 className="font-display font-semibold text-xl text-slate-900 mb-5 flex items-center gap-2">
                <FiCamera className="text-brand-500" /> Property Images
              </h2>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Image URL (optional)</label>
                <input value={form.imageUrl} onChange={e => handleImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all" />
                <p className="text-slate-400 text-xs mt-1">Paste a direct image URL. We'll use a default image if none provided.</p>
              </div>
              {preview && (
                <div className="mt-4 relative">
                  <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-slate-200" />
                  <button onClick={() => { setPreview(null); update("imageUrl", ""); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center text-xs hover:bg-black/70">✕</button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-slate-100 pt-8">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
              <textarea value={form.description} onChange={e => update("description", e.target.value)} rows={5}
                placeholder="Describe your property — highlight key features, nearby amenities, transport links…"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all resize-none ${errors.description ? "border-red-400 bg-red-50" : "border-slate-200"}`} />
              <div className="flex justify-between items-center mt-1">
                {errors.description ? <p className="text-red-500 text-xs">{errors.description}</p> : <span />}
                <span className={`text-xs ${form.description.length < 20 ? "text-slate-400" : "text-emerald-500"}`}>{form.description.length} chars</span>
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="text-slate-400 text-sm">By listing, you agree to our Terms of Service and Privacy Policy.</p>
              <button onClick={handleSubmit} disabled={loading}
                className="btn-primary inline-flex items-center gap-2 shrink-0 disabled:opacity-50">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing…</>
                  : <><FiCheck /> Publish Listing</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
