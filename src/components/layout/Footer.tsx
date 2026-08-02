import React from 'react';
import { Smartphone, MapPin, Phone, Mail, Clock, MessageCircle, Shield, ExternalLink } from 'lucide-react';
import { ContactInfo } from '../../types';

interface FooterProps {
  contactInfo: ContactInfo | null;
  onNavigate: (tab: string, params?: Record<string, any>) => void;
}

export const Footer: React.FC<FooterProps> = ({ contactInfo, onNavigate }) => {
  const categoriesList = [
    'Mobile Covers', 'Chargers', 'Data Cables', 'Power Banks',
    'Earphones', 'Bluetooth Headsets', 'Smart Watches', 'Screen Protectors'
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {contactInfo?.shop_name || 'Apex Mobile Tech'}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted showroom for premium mobile accessories, high-speed charging gear, screen protection, and audio tech. Visit our store or contact us directly for inquiries.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              {contactInfo?.facebook && (
                <a
                  href={contactInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-orange-500 hover:text-white transition"
                  title="Facebook"
                >
                  <span className="font-bold text-sm">f</span>
                </a>
              )}
              {contactInfo?.instagram && (
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-orange-500 hover:text-white transition"
                  title="Instagram"
                >
                  <span className="font-bold text-sm">ig</span>
                </a>
              )}
              {contactInfo?.tiktok && (
                <a
                  href={contactInfo.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-orange-500 hover:text-white transition"
                  title="TikTok"
                >
                  <span className="font-bold text-sm">tk</span>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-l-2 border-orange-500 pl-2">
              Popular Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {categoriesList.map((cat, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate('products', { search: cat })}
                    className="text-slate-400 hover:text-orange-400 transition"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-l-2 border-orange-500 pl-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="text-slate-400 hover:text-orange-400 transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="text-slate-400 hover:text-orange-400 transition">
                  All Product Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="text-slate-400 hover:text-orange-400 transition">
                  Product Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-slate-400 hover:text-orange-400 transition">
                  About Our Shop
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-slate-400 hover:text-orange-400 transition">
                  Contact & Store Location
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-400 transition"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Portal Login
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Info & Direct Inquiry */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-l-2 border-orange-500 pl-2">
              Store & Inquiries
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{contactInfo?.address || '742 Tech District, CA'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`tel:${contactInfo?.phone}`} className="hover:text-white transition">
                  {contactInfo?.phone || '+1 (555) 234-5678'}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`mailto:${contactInfo?.email}`} className="hover:text-white transition">
                  {contactInfo?.email || 'contact@apexmobiletech.com'}
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-slate-400">
                <Clock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span className="text-xs">{contactInfo?.business_hours || 'Mon-Sat: 9am-8pm'}</span>
              </div>

              {contactInfo?.whatsapp && (
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Direct WhatsApp Chat
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} {contactInfo?.shop_name || 'Apex Mobile Accessories'}. All rights reserved.</p>
          <p className="text-slate-400">Catalog Showcase • Product Inquiries Only • No Online Cart Required</p>
        </div>
      </div>
    </footer>
  );
};
