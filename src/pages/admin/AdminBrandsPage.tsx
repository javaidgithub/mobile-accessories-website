import React, { useState } from 'react';
import { Brand } from '../../types';
import { createBrand, updateBrand, deleteBrand } from '../../services/api';
import { Plus, Edit, Trash2, Award, X, AlertCircle } from 'lucide-react';

interface AdminBrandsPageProps {
  brands: Brand[];
  onRefresh: () => void;
}

export const AdminBrandsPage: React.FC<AdminBrandsPageProps> = ({ brands, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const openAddModal = () => {
    setEditingBrand(null);
    setName('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (b: Brand) => {
    setEditingBrand(b);
    setName(b.name);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Brand name is required.');
      return;
    }

    try {
      if (editingBrand) {
        await updateBrand(editingBrand.id, { name });
      } else {
        await createBrand({ name });
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      setError('Failed to save brand.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(`Are you sure you want to delete this brand?`)) {
      try {
        await deleteBrand(id);
        onRefresh();
      } catch (err) {
        alert('Cannot delete brand linked with products.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Brand Directory</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Brands Management</h1>
          <p className="text-xs text-slate-500">Add, edit, or delete manufacturer brands (Anker, Spigen, Apple, etc.).</p>
        </div>

        <button
          onClick={openAddModal}
          className="py-2.5 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {brands.map((b) => (
          <div key={b.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Award className="w-6 h-6 text-orange-400" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base">{b.name}</h3>
              <span className="text-xs text-slate-400 block mt-0.5">{b.product_count || 0} Products</span>
            </div>

            <div className="flex space-x-1 pt-2 border-t border-slate-100 w-full justify-center">
              <button
                onClick={() => openEditModal(b)}
                className="p-1.5 bg-slate-100 hover:bg-orange-500 hover:text-white rounded-lg text-slate-700 transition"
                title="Edit Brand"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="p-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-lg text-rose-600 transition"
                title="Delete Brand"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              {editingBrand ? 'Edit Brand' : 'Add New Brand'}
            </h2>

            {error && (
              <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spigen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-orange-500 text-white font-bold rounded-xl text-xs hover:bg-orange-600"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
