import React from 'react';
import { ContactInfo } from '../types';
import { ShieldCheck, Award, ThumbsUp, MapPin, Phone, Mail, Store, Users, CheckCircle } from 'lucide-react';

interface AboutPageProps {
  contactInfo: ContactInfo | null;
  onNavigateContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ contactInfo, onNavigateContact }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4 shadow-xl">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3.5 py-1.5 rounded-full">
          About {contactInfo?.shop_name || 'Apex Mobile Accessories'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          Your Premium Mobile Accessories Destination
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Providing authentic mobile accessories, chargers, protective covers, audio devices, and smart accessories to enhance your digital lifestyle.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">100% Genuine Brands</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We partner directly with authorized distributors of Anker, Spigen, Belkin, JBL, Baseus, and Ugreen to deliver guaranteed original products.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">In-Store Quality Checks</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every product showcased is physically verified for performance, compatibility, and safety standards before listing.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Direct In-Person Service</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Visit our physical shop location to test accessories in person, try phone cases on your device, or request custom advice from our staff.
          </p>
        </div>
      </div>

      {/* Shop Story */}
      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900">
            Our Shop Philosophy
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            In an era of counterfeit phone accessories and misleading specs, we established <strong>{contactInfo?.shop_name || 'Apex Mobile Accessories'}</strong> to serve as a reliable physical product showcase. Customers deserve clear specifications, accurate compatibility details, and direct communication with knowledgeable shop owners.
          </p>
          <div className="space-y-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Transparent Pricing & Stock Status</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>No Online Payment Hassles — Direct Showroom Pickup</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Dedicated WhatsApp Support & Fast Inquiries</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-sm">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Store className="w-5 h-5 text-orange-500" /> Shop Highlights
          </h3>
          <div className="space-y-2 text-slate-600 text-xs">
            <p><strong className="text-slate-900">Owner:</strong> {contactInfo?.owner_name}</p>
            <p><strong className="text-slate-900">Address:</strong> {contactInfo?.address}</p>
            <p><strong className="text-slate-900">Hotline:</strong> {contactInfo?.phone}</p>
            <p><strong className="text-slate-900">Operating Hours:</strong> {contactInfo?.business_hours}</p>
          </div>
          <button
            onClick={onNavigateContact}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition"
          >
            Visit Shop & Contact Page
          </button>
        </div>
      </div>
    </div>
  );
};
