import React from 'react';
import { Search, Filter, RotateCcw, Check, ArrowUpDown } from 'lucide-react';
import { Category, Brand, ProductFilterParams } from '../../types';

interface ProductFilterProps {
  categories: Category[];
  brands: Brand[];
  filters: ProductFilterParams;
  onChange: (newFilters: ProductFilterParams) => void;
  onReset: () => void;
  totalResults: number;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  brands,
  filters,
  onChange,
  onReset,
  totalResults
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
      {/* Search Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Filter className="w-4 h-4 text-orange-500" /> Filter & Search
          </h3>
          <button
            onClick={onReset}
            className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search products or brands..."
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm pl-9 pr-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Category
        </label>
        <select
          value={filters.category_id || 'all'}
          onChange={(e) => onChange({ ...filters, category_id: e.target.value, page: 1 })}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3 py-2 text-slate-800 focus:outline-none focus:border-orange-500"
        >
          <option value="all">All Categories ({categories.reduce((acc, c) => acc + (c.product_count || 0), 0)})</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.product_count || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Brand
        </label>
        <select
          value={filters.brand_id || 'all'}
          onChange={(e) => onChange({ ...filters, brand_id: e.target.value, page: 1 })}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3 py-2 text-slate-800 focus:outline-none focus:border-orange-500"
        >
          <option value="all">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.product_count || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Stock Availability */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Availability Status
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium">
          <button
            onClick={() => onChange({ ...filters, stock_status: 'all', page: 1 })}
            className={`py-1.5 rounded-lg transition ${
              !filters.stock_status || filters.stock_status === 'all'
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onChange({ ...filters, stock_status: 'in_stock', page: 1 })}
            className={`py-1.5 rounded-lg transition ${
              filters.stock_status === 'in_stock'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() => onChange({ ...filters, stock_status: 'out_of_stock', page: 1 })}
            className={`py-1.5 rounded-lg transition ${
              filters.stock_status === 'out_of_stock'
                ? 'bg-rose-600 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Price Range ($)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price !== undefined ? filters.min_price : ''}
            onChange={(e) =>
              onChange({
                ...filters,
                min_price: e.target.value === '' ? undefined : Number(e.target.value),
                page: 1
              })
            }
            className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl text-sm px-3 py-1.5 text-slate-900 focus:outline-none focus:border-orange-500"
          />
          <span className="text-slate-400 font-bold">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price !== undefined ? filters.max_price : ''}
            onChange={(e) =>
              onChange({
                ...filters,
                max_price: e.target.value === '' ? undefined : Number(e.target.value),
                page: 1
              })
            }
            className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl text-sm px-3 py-1.5 text-slate-900 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-orange-500" /> Sort Order
        </label>
        <select
          value={filters.sort_by || 'newest'}
          onChange={(e) => onChange({ ...filters, sort_by: e.target.value as any })}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm px-3 py-2 text-slate-800 focus:outline-none focus:border-orange-500"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
        </select>
      </div>

      {/* Summary */}
      <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
        <span>Matching Items:</span>
        <span className="font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
          {totalResults} Products
        </span>
      </div>
    </div>
  );
};
