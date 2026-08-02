import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateAdminProfile } from '../../services/api';
import { User, Lock, Mail, Save, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [username, setUsername] = useState(user?.username || 'admin');
  const [email, setEmail] = useState(user?.email || 'admin@apexmobiletech.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await updateAdminProfile({ username, email, newPassword: newPassword || undefined });

      updateUserProfile(username, email);
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Admin Credentials</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Administrator Profile</h1>
        <p className="text-xs text-slate-500">Update admin account username, contact email, and password.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Admin profile updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Username *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm pl-10 pr-4 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm pl-10 pr-4 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-orange-600">
            Change Password (Optional)
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm pl-10 pr-4 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm pl-10 pr-4 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Update Admin Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};


