import React from 'react';
import { Smartphone, Zap, ShieldCheck, Headphones, Watch, BatteryCharging, Cable, Search, ArrowRight, MessageCircle, Phone, CheckCircle2, Store } from 'lucide-react';
import { Product, Category, ContactInfo } from '../types';
import { ProductCard } from '../components/products/ProductCard';

interface HomePageProps {
  featuredProducts: Product[];
  categories: Category[];
  contactInfo: ContactInfo | null;
  onNavigate: (tab: string, params?: Record<string, any>) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  featuredProducts,
  categories,
  contactInfo,
  onNavigate,
  onSelectProduct
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onNavigate('products', { search: searchTerm.trim() });
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <section className="relative bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-900/80 z-0"></div>
        {/* Subtle decorative background blur */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Zap className="w-4 h-4" /> Original & Premium Phone Gear Showcase
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Upgrade Your Tech With <span className="text-orange-500">Premium Accessories</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Explore our showcase of shockproof covers, ultra-fast GaN chargers, braided cables, MagSafe power banks, and high-fidelity headsets. Directly contact us for instant inquiries!
            </p>

            {/* Hero Search */}
            <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-3 pt-2 max-w-xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products (e.g. Spigen, Anker, Charger)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 text-white placeholder-slate-400 text-sm px-4 py-3.5 rounded-xl border border-slate-700 focus:outline-none focus:border-orange-500"
                />
                <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="py-3.5 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-500/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                Explore Catalog <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Value Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Genuine Brands</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>In-Store Inspection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct WhatsApp Chat</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card Stack */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative mx-auto max-w-sm bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-3xl shadow-2xl space-y-4">
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"
                  alt="Accessories Showcase"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-orange-400 font-semibold block uppercase tracking-wider">Store Hotline</span>
                  <span className="text-white font-bold text-sm">{contactInfo?.phone || '+1 (555) 234-5678'}</span>
                </div>
                {contactInfo?.whatsapp && (
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow transition"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore By Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Browse our comprehensive lineup of smartphone gear and tech essentials.
            </p>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition"
          >
            View All Categories <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('products', { category_id: cat.id })}
              className="group bg-white rounded-2xl p-4 border border-slate-200 hover:border-orange-400 hover:shadow-lg transition cursor-pointer text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3 group-hover:bg-orange-500 group-hover:text-white transition duration-300">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-xs text-slate-400 mt-1">
                {cat.product_count || 0} Items
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured & Latest Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold mb-2">
              Featured Showcase
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Latest Arrivals & Best Sellers
            </h2>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            Browse Complete Catalog <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              contactInfo={contactInfo}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 4. About the Shop Preview */}
      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              About Our Showroom
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Premium Accessories Backed By Personal Service
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Founded by tech enthusiasts, <strong>{contactInfo?.shop_name || 'Apex Mobile Accessories'}</strong> brings you authentic accessories from top globally recognized brands. Whether you need a heavy-duty protective case for your flagship phone or ultra-fast GaN charging adapters, we ensure genuine quality and transparent pricing.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-700">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                <Store className="w-5 h-5 text-orange-500" />
                <span>Physical Storefront</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                <span>Genuine Warranty</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('about')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs transition shadow flex items-center gap-2"
            >
              Learn More About Us <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
              Store Hours & Direct Contact
            </h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-900">Owner Name:</span>
                <span>{contactInfo?.owner_name || 'Alex Sterling'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-900">Business Phone:</span>
                <span className="text-orange-600 font-bold">{contactInfo?.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-900">WhatsApp:</span>
                <span className="text-emerald-600 font-bold">{contactInfo?.whatsapp}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-900">Operating Hours:</span>
                <span className="text-xs text-right max-w-xs">{contactInfo?.business_hours}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('contact')}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition text-center"
            >
              Get Directions & Map Location
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
