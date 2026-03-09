import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone, FiHome, FiCheck } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const navigate     = useNavigate();
  const { register } = useAuth();

  const [form, setForm]           = useState({ name:"", email:"", phone:"", password:"", confirm:"" });
  const [errors, setErrors]       = useState({});
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim())                         e.name     = "Full name is required";
    if (!form.email)                               e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))    e.email    = "Enter a valid email";
    if (!form.phone)                               e.phone    = "Phone number is required";
    if (!form.password)                            e.password = "Password is required";
    else if (form.password.length < 6)             e.password = "Password must be at least 6 characters";
    if (!form.confirm)                             e.confirm  = "Please confirm your password";
    else if (form.confirm !== form.password)       e.confirm  = "Passwords do not match";
    return e;
  };

  const pwStrength = () => {
    const p = form.password; let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const strengthLabel = ["","Weak","Fair","Good","Strong"];
  const strengthColor = ["","bg-red-400","bg-amber-400","bg-yellow-400","bg-emerald-500"];

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setApiError(""); setLoading(true);
    try {
      await register({ name:form.name, email:form.email, password:form.password, phone:form.phone });
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      if (msg.toLowerCase().includes("email")) setErrors(e => ({...e, email: msg}));
      else setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const update = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheck className="text-emerald-500 text-4xl" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">Account Created!</h2>
        <p className="text-slate-500 mb-2">Welcome to HouseHunt, <strong>{form.name.split(" ")[0]}</strong>!</p>
        <p className="text-slate-400 text-sm">Redirecting you to the homepage…</p>
      </div>
    </div>
  );

  const strength = pwStrength();

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage:"url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=85')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-brand-900/50" />
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center"><FiHome className="text-white text-xl" /></div>
            <span className="font-display text-2xl font-bold text-white">House<span className="text-brand-400">Hunt</span></span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">Start your journey<br/>to the perfect home.</h2>
            <p className="text-white/60 text-lg mb-8">Join thousands of happy homeowners who found their dream property on HouseHunt.</p>
            {["Access 70+ verified listings","Save your favourite properties","Get personalised recommendations","Connect directly with agents"].map(item=>(
              <div key={item} className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-brand-500/20 rounded-full flex items-center justify-center flex-shrink-0"><FiCheck className="text-brand-400 text-xs" /></div>
                <span className="text-white/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-sm">© 2025 HouseHunt. All rights reserved.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 bg-white lg:max-w-[520px] overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center"><FiHome className="text-white" /></div>
            <span className="font-display text-xl font-bold text-slate-900">House<span className="text-brand-500">Hunt</span></span>
          </Link>
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-500">Free forever. No credit card needed.</p>
          </div>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5">{apiError}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={form.name} onChange={e=>update("name",e.target.value)} placeholder="John Smith"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all ${errors.name?"border-red-400 bg-red-50":"border-slate-200"}`} />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all ${errors.email?"border-red-400 bg-red-50":"border-slate-200"}`} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder="+1 555 000 0000"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all ${errors.phone?"border-red-400 bg-red-50":"border-slate-200"}`} />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPass?"text":"password"} value={form.password} onChange={e=>update("password",e.target.value)} placeholder="Min. 6 characters"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all ${errors.password?"border-red-400 bg-red-50":"border-slate-200"}`} />
                <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPass ? <FiEyeOff /> : <FiEye />}</button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">{[1,2,3,4].map(i=>(<div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i<=strength?strengthColor[strength]:"bg-slate-200"}`}/>))}</div>
                  <p className="text-xs text-slate-500">{strengthLabel[strength]} password</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showConfirm?"text":"password"} value={form.confirm} onChange={e=>update("confirm",e.target.value)} placeholder="Re-enter your password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all ${errors.confirm?"border-red-400 bg-red-50":form.confirm&&form.confirm===form.password?"border-emerald-400":"border-slate-200"}`} />
                <button type="button" onClick={()=>setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showConfirm ? <FiEyeOff /> : <FiEye />}</button>
                {form.confirm&&form.confirm===form.password && <FiCheck className="absolute right-10 top-1/2 -translate-y-1/2 text-emerald-500" />}
              </div>
              {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
            </div>
            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</> : "Create Free Account"}
            </button>
          </div>
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/signin" className="text-brand-500 font-semibold hover:text-brand-600">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
