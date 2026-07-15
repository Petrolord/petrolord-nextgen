import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, Facebook, Instagram, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#020617] border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Column 1: Brand */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#BFFF00] to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(191,255,0,0.3)] overflow-hidden">
                 <img alt="Footer Logo Icon" className="w-full h-full object-cover" src="https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/petrolord-symbol-512-4kVUt.png" />
              </div>
              <span className="text-xl font-bold text-white">Petrolord <span className="font-normal text-slate-300">NextGen</span></span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The academy edition of the Petrolord Suite. Learn hands-on inside the real engineering apps and earn verifiable Associate, Professional and Expert certifications.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-slate-500 hover:text-[#BFFF00] transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-[#BFFF00] transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-[#BFFF00] transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-[#BFFF00] transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Column 2: Academy */}
          <div className="lg:col-span-2 space-y-6">
            <span className="text-white font-semibold text-base block mb-2">Academy</span>
            <ul className="space-y-3">
              <li><Link to="/register" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">Create Account</Link></li>
              <li><a href="/#doors" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">How to Join</a></li>
              <li><a href="/#courses" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">Courses</a></li>
              <li><a href="/#pricing" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">Pricing</a></li>
              <li><Link to="/verify" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">Verify a Certificate</Link></li>
            </ul>
          </div>

          {/* Column 3: UK Office */}
          <div className="lg:col-span-3 space-y-6">
            <span className="text-white font-semibold text-base block mb-2">UK Office</span>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#BFFF00] mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400 leading-relaxed">
                  128 City Road,<br />
                  London, EC1V 2NX,<br />
                  United Kingdom
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#BFFF00] mt-0.5 shrink-0" />
                <a href="tel:+447403660720" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">
                  +44 7403 660720
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Nigeria Office */}
          <div className="lg:col-span-3 space-y-6">
            <span className="text-white font-semibold text-base block mb-2">Nigeria Office</span>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#BFFF00] mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400 leading-relaxed">
                  8 The Providence Street,<br />
                  Lekki Phase 1, Lagos,<br />
                  Nigeria
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#BFFF00] mt-0.5 shrink-0" />
                <a href="tel:+2349015566981" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">
                  +234 901 556 6981
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#BFFF00] mt-0.5 shrink-0" />
                <a href="mailto:info@petrolord.com" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">
                  info@petrolord.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs text-slate-500 order-2 md:order-1">
            &copy; 2026 Lordsway Energy. All Rights Reserved.
          </span>
          <div className="flex items-center gap-6 order-1 md:order-2">
            <Link to="/privacy-policy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/academic-integrity" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Academic Integrity</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
