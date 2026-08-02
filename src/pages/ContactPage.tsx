import React, { useState } from 'react';
import { ContactInfo } from '../types';
import { MapPin, Phone, MessageCircle, Mail, Clock, Send, Store, CheckCircle, ExternalLink } from 'lucide-react';

interface ContactPageProps {
  contactInfo: ContactInfo | null;
}

export const ContactPage: React.FC<ContactPageProps> = ({ contactInfo }) => {
  const [inquirerName, setInquirerName] = useState('');
  const [inquirerPhone, setInquirerPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !contactInfo?.whatsapp) return;

    const cleanWhatsApp = contactInfo.whatsapp.replace(/[^0-9]/g, '');
    const fullText = encodeURIComponent(
      `Hello ${contactInfo.owner_name}!\nName: ${inquirerName || 'Customer'}\nPhone: ${inquirerPhone || 'N/A'}\nMessage: ${message}`
    );

    window.open(`https://wa.me/${cleanWhatsApp}?text=${fullText}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact Us & Visit Our Store
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Have questions about a mobile accessory or stock availability? Contact owner {contactInfo?.owner_name || 'directly'} via phone, WhatsApp, or drop by our showroom.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Business Details Card */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs text-orange-400 font-bold uppercase tracking-wider block">Official Showroom</span>
            <h2 className="text-2xl font-bold text-white mt-1">
              {contactInfo?.shop_name || 'Apex Mobile Accessories'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Managed by: <span className="text-slate-200 font-semibold">{contactInfo?.owner_name || 'Alex Sterling'}</span>
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Shop Address</span>
                <span className="font-medium text-slate-200">{contactInfo?.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Phone Hotline</span>
                <a href={`tel:${contactInfo?.phone}`} className="font-bold text-orange-400 hover:underline">
                  {contactInfo?.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">WhatsApp Line</span>
                <a
                  href={`https://wa.me/${contactInfo?.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  {contactInfo?.whatsapp} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Email Address</span>
                <a href={`mailto:${contactInfo?.email}`} className="font-medium text-slate-200 hover:underline">
                  {contactInfo?.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-slate-800 pt-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Business Operating Hours</span>
                <span className="text-xs text-slate-300 leading-relaxed block mt-0.5">
                  {contactInfo?.business_hours}
                </span>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="border-t border-slate-800 pt-4">
            <span className="text-xs text-slate-400 block mb-3 font-semibold">Follow Our Social Pages</span>
            <div className="flex space-x-3">
              {contactInfo?.facebook && (
                <a
                  href={contactInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-orange-500 text-xs text-white rounded-lg transition"
                >
                  Facebook
                </a>
              )}
              {contactInfo?.instagram && (
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-orange-500 text-xs text-white rounded-lg transition"
                >
                  Instagram
                </a>
              )}
              {contactInfo?.tiktok && (
                <a
                  href={contactInfo.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-orange-500 text-xs text-white rounded-lg transition"
                >
                  TikTok
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Direct Inquiry Form & Map */}
        <div className="lg:col-span-7 space-y-8">
          {/* Direct Inquiry Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" /> Send Direct WhatsApp Inquiry
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill out the form below to initiate an instant chat with the shop owner regarding any product or question.
              </p>
            </div>

            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Inquiry message launched in WhatsApp! We will respond promptly.</span>
              </div>
            )}

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={inquirerName}
                    onChange={(e) => setInquirerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +1 555-0192"
                    value={inquirerPhone}
                    onChange={(e) => setInquirerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message / Product Inquiry *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ask about product availability, stock, pricing, or shop location..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3.5 text-slate-900 focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Start WhatsApp Inquiry
              </button>
            </form>
          </div>

          {/* Google Maps Embed */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Store className="w-5 h-5 text-orange-500" /> Store Location & Map
            </h3>

            <div className="aspect-16/9 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <iframe
                title="Shop Google Maps Location"
                src={contactInfo?.google_map || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0192348123!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808e00000001%3A0x123456789abcdef!2sTech%20District!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
