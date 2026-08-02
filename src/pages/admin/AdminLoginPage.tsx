import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, User, AlertCircle, Smartphone } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        onLoginSuccess();
      } else {
        setError('Invalid admin credentials. Please try again.');
      }
    } catch (err) {
      setError('Connection error while authenticating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-xs text-slate-500">Sign in to manage catalog products, categories & contact details</p>
        </div>

        {/* Credentials Helper Hint Box */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-xs text-slate-700 space-y-1">
          <p className="font-bold text-orange-700 flex items-center gap-1">
            <Smartphone className="w-4 h-4" /> Default Administrator Credentials:
          </p>
          <div className="font-mono text-slate-900 bg-white p-2 rounded-lg border border-orange-200 space-y-0.5 mt-1">
            <p>Username: <strong className="text-orange-600">admin</strong></p>
            <p>Password: <strong className="text-orange-600">admin123</strong></p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Username or Email
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
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm pl-10 pr-4 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In To Dashboard'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium underline"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
