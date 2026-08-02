import React, { useState } from 'react';
import { Smartphone, Phone, MessageCircle, Menu, X, Shield, LayoutDashboard, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ContactInfo } from '../../types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, params?: Record<string, any>) => void;
  contactInfo: ContactInfo | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, contactInfo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const { isAdmin, user, logout } = useAuth();

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'categories', label: 'Categories' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onNavigate('products', { search: quickSearch.trim() });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
      {/* Top Banner Bar */}
      <div className="bg-slate-950 border-b border-slate-800 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-4 text-slate-300">
            <span className="flex items-center gap-1.5 font-medium text-orange-400">
              <Phone className="w-3.5 h-3.5" />
              Call Us: {contactInfo?.phone || '+1 (555) 234-5678'}
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">
              Direct Inquiries & Wholesale Showcase
            </span>
          </div>

          <div className="flex items-center space-x-3 text-slate-300">
            {contactInfo?.whatsapp && (
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Inquiry
              </a>
            )}
            <span className="text-slate-700">|</span>
            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="flex items-center gap-1 text-orange-400 hover:text-orange-300 font-semibold"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin Panel ({user?.username})
                </button>
                <button
                  onClick={logout}
                  title="Logout Admin"
                  className="text-slate-400 hover:text-red-400 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('admin-login')}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition duration-200">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block leading-none">
                {contactInfo?.shop_name ? contactInfo.shop_name.split(' ')[0] : 'Apex'}
                <span className="text-orange-500"> Mobile</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 block mt-0.5">
                Accessories Showcase
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search accessories or brand..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="w-full bg-slate-800 text-white text-sm placeholder-slate-400 pl-3.5 pr-9 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-orange-500 transition"
            />
            <button type="submit" className="absolute right-2 text-slate-400 hover:text-orange-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-orange-500 text-white font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className={`ml-2 px-3.5 py-2 rounded-lg text-sm font-medium border border-orange-500/40 text-orange-400 hover:bg-orange-500/10 transition ${
                  currentTab.startsWith('admin') ? 'bg-orange-500/20 font-bold' : ''
                }`}
              >
                Dashboard
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative mb-3">
            <input
              type="text"
              placeholder="Search products or brand..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="w-full bg-slate-800 text-white text-sm placeholder-slate-400 pl-3.5 pr-9 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-orange-500"
            />
            <button type="submit" className="absolute right-3 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentTab === link.id
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('admin-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-md text-base font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30"
              >
                Admin Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
