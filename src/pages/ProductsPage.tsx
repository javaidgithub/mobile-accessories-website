import React from 'react';
import { ProductCard } from '../components/products/ProductCard';
import { ProductFilter } from '../components/products/ProductFilter';
import { Product, Category, Brand, ContactInfo, ProductFilterParams } from '../types';
import { ChevronLeft, ChevronRight, SlidersHorizontal, PackageSearch } from 'lucide-react';

interface ProductsPageProps {
  products: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  categories: Category[];
  brands: Brand[];
  filters: ProductFilterParams;
  contactInfo: ContactInfo | null;
  onFilterChange: (newFilters: ProductFilterParams) => void;
  onFilterReset: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  totalProducts,
  currentPage,
  totalPages,
  categories,
  brands,
  filters,
  contactInfo,
  onFilterChange,
  onFilterReset,
  onSelectProduct
}) => {
  const [showMobileFilter, setShowMobileFilter] = React.useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
            Catalog Showcase
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-1">
            Mobile Accessories Collection
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Browse through our full stock of authentic phone accessories. Click any item to view specifications and contact us directly!
          </p>
        </div>

        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="md:hidden py-2.5 px-4 bg-orange-500 text-white font-bold rounded-xl text-xs flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filter Catalog
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Filter Sidebar (Desktop) */}
        <div className="hidden md:block md:col-span-1 sticky top-24">
          <ProductFilter
            categories={categories}
            brands={brands}
            filters={filters}
            onChange={onFilterChange}
            onReset={onFilterReset}
            totalResults={totalProducts}
          />
        </div>

        {/* Mobile Filter Modal */}
        {showMobileFilter && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setShowMobileFilter(false)}
                className="absolute top-3 right-3 text-xs font-bold text-slate-600 bg-slate-200 px-3 py-1 rounded-full z-10"
              >
                Close Filters
              </button>
              <ProductFilter
                categories={categories}
                brands={brands}
                filters={filters}
                onChange={(f) => {
                  onFilterChange(f);
                }}
                onReset={onFilterReset}
                totalResults={totalProducts}
              />
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="md:col-span-3 space-y-6">
          {products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto">
                <PackageSearch className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Products Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                We couldn't find any products matching your current filters or search query. Try resetting filters or adjusting search keywords.
              </p>
              <button
                onClick={onFilterReset}
                className="py-2.5 px-5 bg-orange-500 text-white font-bold rounded-xl text-xs hover:bg-orange-600 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Product Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    contactInfo={contactInfo}
                    onSelect={onSelectProduct}
                  />
                ))}
              </div>

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">
                    Page {currentPage} of {totalPages} ({totalProducts} total items)
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => onFilterChange({ ...filters, page: currentPage - 1 })}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                        <button
                          key={pg}
                          onClick={() => onFilterChange({ ...filters, page: pg })}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                            currentPage === pg
                              ? 'bg-orange-500 text-white shadow'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {pg}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => onFilterChange({ ...filters, page: currentPage + 1 })}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
