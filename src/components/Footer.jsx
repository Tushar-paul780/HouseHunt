import { Link } from "react-router-dom";
import { FiHome, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const quickLinks = [
  { label:"Home",            to:"/" },
  { label:"Buy Property",    to:"/search?status=For+Sale" },
  { label:"Rent Property",   to:"/search?status=For+Rent" },
  { label:"List Property",   to:"/list-property" },
  { label:"Our Agents",      to:"/#agents" },
];
const support = ["Help Center","Privacy Policy","Terms of Service","Cookie Policy","Sitemap","Careers"];

export default function Footer() {
  return (
    <footer id="footer" className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
                <FiHome className="text-white text-lg" />
              </div>
              <span className="font-display text-xl font-bold text-white tracking-tight">
                House<span className="text-brand-500">Hunt</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Your trusted partner in finding the perfect home. Connecting buyers, sellers, and renters with ease.
            </p>
            <div className="flex gap-3">
              {[FaFacebookF,FaTwitter,FaInstagram,FaLinkedinIn,FaYoutube].map((Icon,i)=>(
                <a key={i} href="#" className="w-9 h-9 bg-slate-800 hover:bg-brand-500 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(link=>(
                <li key={link.label}>
                  <Link to={link.to} className="text-sm hover:text-brand-400 transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 bg-brand-500/0 group-hover:bg-brand-500 rounded-full transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3">
              {support.map(link=>(
                <li key={link}><a href="#" className="text-sm hover:text-brand-400 transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3"><FiMapPin className="text-brand-500 mt-0.5 flex-shrink-0" /><span className="text-sm leading-relaxed">350 Fifth Avenue, Suite 4100<br/>New York, NY 10118</span></li>
              <li className="flex items-center gap-3"><FiPhone className="text-brand-500 flex-shrink-0" /><a href="tel:+15559876543" className="text-sm hover:text-brand-400 transition-colors">+1 (555) 987-6543</a></li>
              <li className="flex items-center gap-3"><FiMail className="text-brand-500 flex-shrink-0" /><a href="mailto:hello@househunt.com" className="text-sm hover:text-brand-400 transition-colors">hello@househunt.com</a></li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">Subscribe for updates</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors" />
                <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0">Go</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-sm">© 2025 HouseHunt. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy","Terms","Cookies"].map(item=>(
              <a key={item} href="#" className="text-slate-500 hover:text-brand-400 text-sm transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
