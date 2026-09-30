import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, Facebook, Instagram, MapPin, Phone } from 'lucide-react';
import { BRAND_MARK } from '@/components/public/PublicPage';

// The footer of the legal pages (its only user; the regal homepage has its
// own HomeFooter). Batch 6B: an ink strip, a fixed dark scope like the brand
// bar, on the family roles with the gold accent.

const Footer = () => {
  return (
    <footer data-pl-theme="dark" data-testid="public-footer" className="bg-pl-surface text-pl-text border-t border-pl-accent/20 pt-16 pb-8 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Column 1: Brand */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-pl-accent bg-pl-bg flex items-center justify-center overflow-hidden">
                 <img alt="" aria-hidden="true" className="w-full h-full object-cover" src={BRAND_MARK} />
              </div>
              <span className="font-pl-display text-xl font-semibold text-pl-text">Petrolord <span className="text-pl-accent-text">NextGen</span></span>
            </div>

            <p className="text-pl-muted text-sm leading-relaxed max-w-sm">
              The academy edition of the Petrolord Suite. Learn hands-on inside the real engineering apps and earn verifiable Associate, Professional and Expert certifications.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-pl-muted hover:text-pl-accent-text transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-pl-muted hover:text-pl-accent-text transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-pl-muted hover:text-pl-accent-text transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-pl-muted hover:text-pl-accent-text transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Column 2: Academy */}
          <div className="lg:col-span-2 space-y-6">
            <span className="text-pl-text font-semibold text-base block mb-2">Academy</span>
            <ul className="space-y-3">
              <li><Link to="/register" className="text-sm text-pl-muted hover:text-pl-accent-text transition-colors">Create Account</Link></li>
              <li><a href="/#how" className="text-sm text-pl-muted hover:text-pl-accent-text transition-colors">How It Works</a></li>
              <li><a href="/#courses" className="text-sm text-pl-muted hover:text-pl-accent-text transition-colors">Courses</a></li>
              <li><a href="/#fees" className="text-sm text-pl-muted hover:text-pl-accent-text transition-colors">Fees</a></li>
              <li><Link to="/verify" className="text-sm text-pl-muted hover:text-pl-accent-text transition-colors">Verify a Certificate</Link></li>
            </ul>
          </div>

          {/* Column 3: UK Office */}
          <div className="lg:col-span-3 space-y-6">
            <span className="text-pl-text font-semibold text-base block mb-2">UK Office</span>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pl-accent-text mt-0.5 shrink-0" />
                <span className="text-sm text-pl-muted leading-relaxed">
                  128 City Road,<br />
                  London, EC1V 2NX,<br />
                  United Kingdom
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-pl-accent-text mt-0.5 shrink-0" />
                <a href="tel:+447403660720" className="text-sm text-pl-muted hover:text-pl-accent-text transition-colors">
                  +44 7403 660720
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Nigeria Office */}
          <div className="lg:col-span-3 space-y-6">
            <span className="text-pl-text font-semibold text-base block mb-2">Nigeria Office</span>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pl-accent-text mt-0.5 shrink-0" />
                <span className="text-sm text-pl-muted leading-relaxed">
                  8 The Providence Street,<br />
                  Lekki Phase 1, Lagos,<br />
                  Nigeria
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-pl-accent-text mt-0.5 shrink-0" />
                <a href="tel:+2349015566981" className="text-sm text-pl-muted hover:text-pl-accent-text transition-colors">
                  +234 901 556 6981
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-pl-accent-text mt-0.5 shrink-0" />
                <a href="mailto:info@petrolord.com" className="text-sm text-pl-muted hover:text-pl-accent-text transition-colors">
                  info@petrolord.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-pl-accent-text mt-0.5 shrink-0" />
                <a href="mailto:info@lordswayenergy.com" className="text-sm text-pl-muted hover:text-pl-accent-text transition-colors">
                  info@lordswayenergy.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-pl-border flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs text-pl-muted order-2 md:order-1">
            &copy; 2026 Lordsway Energy. All Rights Reserved.
          </span>
          <div className="flex items-center gap-6 order-1 md:order-2">
            <Link to="/privacy-policy" className="text-xs text-pl-muted hover:text-pl-text transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-xs text-pl-muted hover:text-pl-text transition-colors">Terms of Service</Link>
            <Link to="/academic-integrity" className="text-xs text-pl-muted hover:text-pl-text transition-colors">Academic Integrity</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
