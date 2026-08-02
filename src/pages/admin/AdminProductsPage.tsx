import React, { useState, useEffect } from 'react';
import { Product, Category, Brand, StockStatus } from '../../types';
import { fetchProducts, createProduct, updateProduct, deleteProduct, uploadImageFile } from '../../services/api';
import { Plus, Edit, Trash2, Search, Filter, Upload, Image as ImageIcon, X, Check, RefreshCw, AlertCircle } from 'lucide-react';

interface AdminProductsPageProps {
  categories: Category[];
  brands: Brand[];
  editingProduct: Product | null;
  onClearEditingProduct: () => void;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({
  categories,
  brands,
  editingProduct,
  onClearEditingProduct
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 1);
  const [brandId, setBrandId] = useState<number>(brands[0]?.id || 1);
  const [price, setPrice] = useState<number>(19.99);
  const [stockStatus, setStockStatus] = useState<StockStatus>('in_stock');
  const [description, setDescription] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Confirmation State
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchProducts({
        search,
        category_id: selectedCat,
        brand_id: selectedBrand,
        page,
        limit: 10
      });
      setProducts(res.products);
      setTotal(res.total);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, search, selectedCat, selectedBrand]);

  useEffect(() => {
    if (editingProduct) {
      openEditModal(editingProduct);
    }
  }, [editingProduct]);

  const openAddModal = () => {
    onClearEditingProduct();
    setCurrentProduct(null);
    setName('');
    setCategoryId(categories[0]?.id || 1);
    setBrandId(brands[0]?.id || 1);
    setPrice(19.99);
    setStockStatus('in_stock');
    setDescription('');
    setSpecifications('');
    setImageUrl('https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setCurrentProduct(p);
    setName(p.name);
    setCategoryId(p.category_id);
    setBrandId(p.brand_id);
    setPrice(p.price);
    setStockStatus(p.stock_status);
    setDescription(p.description);
    setSpecifications(p.specifications || '');
    setImageUrl(p.image);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadImageFile(file);
      setImageUrl(url);
    } catch (err) {
      console.error('Image upload failed, fallback to data URL');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (price <= 0) {
      setFormError('Price must be greater than zero.');
      return;
    }

    setFormError('');
    try {
      const payload = {
        name,
        category_id: Number(categoryId),
        brand_id: Number(brandId),
        price: Number(price),
        stock_status: stockStatus,
        description,
        specifications,
        image: imageUrl || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
      };

      if (currentProduct && currentProduct.id) {
        await updateProduct(currentProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      setIsModalOpen(false);
      onClearEditingProduct();
      loadProducts();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteProduct(deleteTargetId);
      setDeleteTargetId(null);
      loadProducts();
    } catch (err) {
      console.error('Failed deleting product:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Product Management</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Products Catalog CRUD</h1>
          <p className="text-xs text-slate-500">Create, update, or remove mobile accessories from your store catalog.</p>
        </div>

        <button
          onClick={openAddModal}
          className="py-2.5 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-9 pr-4 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => {
              setSelectedCat(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <button
            onClick={loadProducts}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-900 text-white uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Image & Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No products matching your search or filter.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-slate-400">#{p.id}</td>
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={p.image}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="block text-sm line-clamp-1">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal line-clamp-1">{p.description}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{p.category_name}</td>
                    <td className="p-4 font-medium">{p.brand_name}</td>
                    <td className="p-4 font-black text-slate-900 text-sm">${p.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.stock_status === 'in_stock'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 bg-slate-100 hover:bg-orange-500 hover:text-white rounded-xl text-slate-700 transition"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(p.id)}
                        className="p-2 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl text-rose-600 transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => {
                setIsModalOpen(false);
                onClearEditingProduct();
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              {currentProduct?.id ? `Edit Product #${currentProduct.id}` : 'Add New Product'}
            </h2>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spigen Tough Armor Case for iPhone 15"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Brand *
                  </label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Stock Availability Status *
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product Image
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="text"
                    placeholder="https://... or upload image"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3.5 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  />

                  <label className="cursor-pointer py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs shrink-0 flex items-center gap-1.5 transition">
                    <Upload className="w-4 h-4" />
                    {uploadingImage ? 'Uploading...' : 'Upload File'}
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                  </label>
                </div>

                {imageUrl && (
                  <div className="mt-2 flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <span className="text-xs text-slate-500 line-clamp-1">Image preview verified</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter detailed description of the mobile accessory..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 text-slate-900 focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Specifications (Line by line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Material: TPU\nOutput: 65W GaN\nWarranty: 1 Year"
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 text-slate-900 focus:outline-none focus:border-orange-500 font-mono text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow transition"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Delete Product?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete Product #{deleteTargetId}? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="py-2.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow transition"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
