import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail, FiLock, FiHome } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const navigate    = useNavigate();
  const { login }   = useAuth();

  const [form,     setForm]     = useState({ email:"", password:"", remember:false });
  const [errors,   setErrors]   = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.email)                             e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))  e.email    = "Enter a valid email";
    if (!form.password)                          e.password = "Password is required";
    else if (form.password.length < 6)           e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setApiError(""); setLoading(true);
    try {
      await login({ email: form.email, password: form.password }, form.remember);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const update = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage:"url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-brand-900/50" />
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <FiHome className="text-white text-xl" />
            </div>
            <span className="font-display text-2xl font-bold text-white">House<span className="text-brand-400">Hunt</span></span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
              Your dream home<br/>is one login away.
            </h2>
            <p className="text-white/60 text-lg">Access 70+ verified listings, saved searches, and personalised recommendations.</p>
            <div className="flex gap-8 mt-10">
              {[["70+","Listings"],["15+","Cities"],["4","Agents"]].map(([v,l])=>(
                <div key={l}>
                  <div className="font-display text-3xl font-bold text-brand-400">{v}</div>
                  <div className="text-white/50 text-sm">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/30 text-sm">© 2025 HouseHunt. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 bg-white lg:max-w-[520px]">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center"><FiHome className="text-white" /></div>
            <span className="font-display text-xl font-bold text-slate-900">House<span className="text-brand-500">Hunt</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-500">Sign in to continue your property search</p>
          </div>

          {/* Demo credentials hint */}
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 mb-6 text-sm text-brand-700">
            <strong>Demo:</strong> demo@househunt.com / demo1234
            <span className="ml-2 text-brand-400 text-xs">(run npm run seed first)</span>
          </div>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5">
              {apiError}
            </div>
          )}

          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={form.email} onChange={e=>update("email",e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all ${errors.email?"border-red-400 bg-red-50":"border-slate-200 focus:border-brand-400"}`} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs text-brand-500 hover:text-brand-600 font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPass?"text":"password"} value={form.password} onChange={e=>update("password",e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleSubmit()} placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all ${errors.password?"border-red-400 bg-red-50":"border-slate-200 focus:border-brand-400"}`} />
                <button type="button" onClick={()=>setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" checked={form.remember} onChange={e=>update("remember",e.target.checked)} className="sr-only" />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${form.remember?"bg-brand-500 border-brand-500":"border-slate-300 group-hover:border-brand-400"}`}>
                  {form.remember && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                </div>
              </div>
              <span className="text-sm text-slate-600">Remember me for 30 days</span>
            </label>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</> : "Sign In"}
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-brand-500 font-semibold hover:text-brand-600">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
