import React, { useEffect, useState } from 'react';
import { DashboardStats, Product } from '../../types';
import { fetchAdminStats, fetchProducts } from '../../services/api';
import { Package, Tag, Award, CheckCircle, XCircle, Plus, Edit, ArrowRight, Smartphone, RefreshCw } from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigateTab: (tab: string) => void;
  onEditProduct: (product: Product) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateTab, onEditProduct }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, pData] = await Promise.all([
        fetchAdminStats(),
        fetchProducts({ limit: 5, sort_by: 'newest' })
      ]);
      setStats(sData);
      setRecentProducts(pData.products);
    } catch (err) {
      console.error('Failed loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
            Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Admin Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor product inventory, brand counts, and quick management links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
            title="Refresh statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigateTab('admin-products')}
            className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
            <Package className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Products</span>
          <span className="text-2xl font-black text-slate-900">{stats?.total_products ?? '-'}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <CheckCircle className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">In Stock</span>
          <span className="text-2xl font-black text-emerald-600">{stats?.products_in_stock ?? '-'}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
            <XCircle className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Out of Stock</span>
          <span className="text-2xl font-black text-rose-600">{stats?.products_out_of_stock ?? '-'}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <Tag className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Categories</span>
          <span className="text-2xl font-black text-slate-900">{stats?.total_categories ?? '-'}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1 col-span-2 md:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Brands</span>
          <span className="text-2xl font-black text-slate-900">{stats?.total_brands ?? '-'}</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab('admin-products')}
          className="bg-slate-900 text-white p-5 rounded-3xl hover:bg-slate-800 transition text-left flex justify-between items-center group shadow-md"
        >
          <div>
            <span className="text-xs text-orange-400 font-semibold block">Manage Catalog</span>
            <span className="text-base font-bold text-white mt-0.5 block">Products CRUD</span>
          </div>
          <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => onNavigateTab('admin-categories')}
          className="bg-white text-slate-900 border border-slate-200 p-5 rounded-3xl hover:border-orange-400 transition text-left flex justify-between items-center group shadow-sm"
        >
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Categories</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">Category CRUD</span>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => onNavigateTab('admin-brands')}
          className="bg-white text-slate-900 border border-slate-200 p-5 rounded-3xl hover:border-orange-400 transition text-left flex justify-between items-center group shadow-sm"
        >
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Brand Directory</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">Brands CRUD</span>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => onNavigateTab('admin-contact')}
          className="bg-white text-slate-900 border border-slate-200 p-5 rounded-3xl hover:border-orange-400 transition text-left flex justify-between items-center group shadow-sm"
        >
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Shop Details</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">Contact & Hours</span>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-orange-500" /> Recently Added Products
          </h3>
          <button
            onClick={() => onNavigateTab('admin-products')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            View All Products <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-semibold text-slate-900 flex items-center gap-3">
                    <img src={p.image} alt="" className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <span className="line-clamp-1">{p.name}</span>
                  </td>
                  <td className="p-3">{p.category_name}</td>
                  <td className="p-3">{p.brand_name}</td>
                  <td className="p-3 font-bold text-slate-900">${p.price.toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock_status === 'in_stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onEditProduct(p)}
                      className="p-1.5 bg-slate-100 hover:bg-orange-500 hover:text-white rounded-lg text-slate-700 transition"
                      title="Edit Product"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
