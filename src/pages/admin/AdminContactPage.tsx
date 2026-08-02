import React, { useState, useEffect } from 'react';
import { ContactInfo } from '../../types';
import { updateContactInfo } from '../../services/api';
import { Store, Save, CheckCircle, AlertCircle, MapPin, Phone, MessageCircle, Mail, Clock, Globe } from 'lucide-react';

interface AdminContactPageProps {
  contactInfo: ContactInfo | null;
  onRefresh: () => void;
}

export const AdminContactPage: React.FC<AdminContactPageProps> = ({ contactInfo, onRefresh }) => {
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [googleMap, setGoogleMap] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [businessHours, setBusinessHours] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (contactInfo) {
      setShopName(contactInfo.shop_name || '');
      setOwnerName(contactInfo.owner_name || '');
      setPhone(contactInfo.phone || '');
      setWhatsapp(contactInfo.whatsapp || '');
      setEmail(contactInfo.email || '');
      setAddress(contactInfo.address || '');
      setGoogleMap(contactInfo.google_map || '');
      setFacebook(contactInfo.facebook || '');
      setInstagram(contactInfo.instagram || '');
      setTiktok(contactInfo.tiktok || '');
      setBusinessHours(contactInfo.business_hours || '');
    }
  }, [contactInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      await updateContactInfo({
        shop_name: shopName,
        owner_name: ownerName,
        phone,
        whatsapp,
        email,
        address,
        google_map: googleMap,
        facebook,
        instagram,
        tiktok,
        business_hours: businessHours
      });
      setSuccess(true);
      onRefresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update shop contact information.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Store Settings</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Contact Details & Store Info</h1>
          <p className="text-xs text-slate-500">Update business phone, WhatsApp line, address, map link, and social profiles.</p>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Shop contact details updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Shop Name *
            </label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Owner / Manager Name *
            </label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-orange-500" /> Phone Number *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Number *
            </label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-orange-500" /> Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-orange-500" /> Shop Physical Address *
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-orange-500" /> Operating Business Hours
          </label>
          <input
            type="text"
            value={businessHours}
            onChange={(e) => setBusinessHours(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-orange-500" /> Google Map Embed URL
          </label>
          <input
            type="text"
            value={googleMap}
            onChange={(e) => setGoogleMap(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
          />
        </div>

        {/* Social Media Links */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Social Media Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Facebook URL</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Instagram URL</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">TikTok URL</label>
              <input
                type="text"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs px-3 py-2 text-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving Changes...' : 'Save Contact Info'}
          </button>
        </div>
      </form>
    </div>
  );
};
