import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiHome, FiUser, FiLogOut, FiChevronDown, FiPlusCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Home",          to: "/" },
  { label: "Buy",           to: "/search?status=For+Sale" },
  { label: "Rent",          to: "/search?status=For+Rent" },
  { label: "List Property", to: "/list-property" },
  { label: "Agents",        to: "/#agents" },
  { label: "Contact",       to: "/#footer" },
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout }       = useAuth();
  const navigate               = useNavigate();
  const location               = useLocation();
  const menuRef                = useRef(null);

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const forceLight = !isHome || scrolled;

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    navigate("/");
  };

  const initials = user
    ? user.name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        forceLight
          ? "bg-white/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-brand-600 transition-colors">
              <FiHome className="text-white text-lg" />
            </div>
            <span className={`font-display text-xl font-bold tracking-tight transition-colors ${forceLight ? "text-slate-900" : "text-white"}`}>
              House<span className="text-brand-500">Hunt</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className={`nav-link text-sm font-medium transition-colors ${
                    forceLight ? "text-slate-600 hover:text-brand-500" : "text-white/90 hover:text-white"
                  } ${link.label === "List Property" ? "flex items-center gap-1" : ""}`}
                >
                  {link.label === "List Property" && <FiPlusCircle className="text-brand-500 text-base" />}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2 hover:border-brand-400 transition-all shadow-sm"
                >
                  <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user.name?.split(" ")[0]}
                  </span>
                  <FiChevronDown className={`text-slate-400 text-sm transition-transform ${userMenu ? "rotate-180" : ""}`} />
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50">
                    <div className="px-3 py-2 mb-1">
                      <p className="font-semibold text-slate-800 text-sm truncate">{user.name}</p>
                      <p className="text-slate-400 text-xs truncate">{user.email}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-1">
                      <Link to="/list-property" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 hover:text-brand-500 hover:bg-brand-50 rounded-xl transition-colors">
                        <FiPlusCircle /> List a Property
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <FiLogOut /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signin" className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all ${forceLight ? "text-slate-700 hover:text-brand-500" : "text-white hover:text-brand-300"}`}>
                  Login
                </Link>
                <Link to="/signup" className="px-5 py-2.5 text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${forceLight ? "text-slate-700" : "text-white"}`}
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${open ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
          <div className="bg-white rounded-2xl shadow-2xl p-5 border border-slate-100">
            {user && (
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">{initials}</div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                  <p className="text-slate-400 text-xs">{user.email}</p>
                </div>
              </div>
            )}
            <ul className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-slate-700 hover:text-brand-500 hover:bg-brand-50 rounded-xl text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              {user ? (
                <button onClick={handleLogout} className="flex-1 py-2.5 text-sm font-semibold text-red-500 border-2 border-red-100 rounded-xl hover:bg-red-50 transition-all">
                  Sign Out
                </button>
              ) : (
                <>
                  <Link to="/signin" onClick={() => setOpen(false)} className="flex-1 py-2.5 text-sm font-semibold text-center text-slate-700 border-2 border-slate-200 rounded-xl hover:border-brand-500 hover:text-brand-500 transition-all">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="flex-1 py-2.5 text-sm font-semibold text-center bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-all shadow-md">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
