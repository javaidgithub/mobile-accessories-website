import React, { useState } from 'react';
import { Category } from '../../types';
import { createCategory, updateCategory, deleteCategory } from '../../services/api';
import { Plus, Edit, Trash2, Tag, X, Check, AlertCircle } from 'lucide-react';

interface AdminCategoriesPageProps {
  categories: Category[];
  onRefresh: () => void;
}

export const AdminCategoriesPage: React.FC<AdminCategoriesPageProps> = ({ categories, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Smartphone');
  const [error, setError] = useState('');

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIconName('Smartphone');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIconName(cat.iconName || 'Smartphone');
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name, description, iconName });
      } else {
        await createCategory({ name, description, iconName });
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      setError('Failed to save category.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(`Are you sure you want to delete this category?`)) {
      try {
        await deleteCategory(id);
        onRefresh();
      } catch (err) {
        alert('Cannot delete category with associated products.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Category Directory</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Categories Management</h1>
          <p className="text-xs text-slate-500">Add, update, or remove accessory categories.</p>
        </div>

        <button
          onClick={openAddModal}
          className="py-2.5 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs">
                  <Tag className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                  {cat.product_count || 0} Products
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{cat.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{cat.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button
                onClick={() => openEditModal(cat)}
                className="p-1.5 bg-slate-100 hover:bg-orange-500 hover:text-white rounded-lg text-slate-700 transition"
                title="Edit Category"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-lg text-rose-600 transition"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>

            {error && (
              <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 text-slate-900 focus:outline-none focus:border-orange-500"
                ></textarea>
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
