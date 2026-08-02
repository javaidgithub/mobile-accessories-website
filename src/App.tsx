import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ProductDetailsModal } from './components/products/ProductDetailsModal';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminBrandsPage } from './pages/admin/AdminBrandsPage';
import { AdminContactPage } from './pages/admin/AdminContactPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';

import { Product, Category, Brand, ContactInfo, ProductFilterParams } from './types';
import { fetchCategories, fetchBrands, fetchContactInfo, fetchProducts } from './services/api';

function MainApp() {
  const [currentTab, setCurrentTab] = useState('home');
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Public Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<ProductFilterParams>({ page: 1, limit: 9, sort_by: 'newest' });

  // Featured homepage products
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Product Modal detail view state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Admin Editing Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { isAdmin } = useAuth();

  const loadInitialData = async () => {
    try {
      const [cData, bData, infoData, fpData] = await Promise.all([
        fetchCategories(),
        fetchBrands(),
        fetchContactInfo(),
        fetchProducts({ limit: 6, sort_by: 'newest' })
      ]);
      setCategories(cData);
      setBrands(bData);
      setContactInfo(infoData);
      setFeaturedProducts(fpData.products);
    } catch (err) {
      console.error('Initial data load error:', err);
    }
  };

  const loadProductsData = async (params: ProductFilterParams) => {
    try {
      const res = await fetchProducts(params);
      setProducts(res.products);
      setTotalProducts(res.total);
      setCurrentPage(res.page);
      setTotalPages(res.total_pages);
    } catch (err) {
      console.error('Products load error:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (currentTab === 'products') {
      loadProductsData(filters);
    }
  }, [currentTab, filters]);

  const handleNavigate = (tab: string, params?: Record<string, any>) => {
    setCurrentTab(tab);
    if (tab === 'products' && params) {
      setFilters(prev => ({
        ...prev,
        ...params,
        page: 1
      }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = async (product: Product) => {
    setSelectedProduct(product);
    try {
      const relRes = await fetchProducts({ category_id: product.category_id, limit: 5 });
      setRelatedProducts(relRes.products.filter(p => p.id !== product.id));
    } catch (err) {
      console.error('Failed to load related products', err);
    }
  };

  const handleFilterChange = (newFilters: ProductFilterParams) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    setFilters({ page: 1, limit: 9, sort_by: 'newest', search: '', category_id: 'all', brand_id: 'all', stock_status: 'all' });
  };

  const handleEditProductFromDashboard = (p: Product) => {
    setEditingProduct(p);
    setCurrentTab('admin-products');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col justify-between font-sans selection:bg-orange-500 selection:text-white">
      <div>
        {/* Navigation Bar */}
        <Navbar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          contactInfo={contactInfo}
        />

        {/* Admin Navigation Secondary Sub-Bar */}
        {isAdmin && currentTab.startsWith('admin') && (
          <div className="bg-slate-800 text-slate-300 text-xs py-2 px-4 border-b border-slate-700">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="font-bold text-orange-400 uppercase tracking-wider">Admin Navigation:</span>
              <button
                onClick={() => handleNavigate('admin-dashboard')}
                className={`px-2.5 py-1 rounded-md transition ${currentTab === 'admin-dashboard' ? 'bg-orange-500 text-white font-bold' : 'hover:bg-slate-700'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigate('admin-products')}
                className={`px-2.5 py-1 rounded-md transition ${currentTab === 'admin-products' ? 'bg-orange-500 text-white font-bold' : 'hover:bg-slate-700'}`}
              >
                Products CRUD
              </button>
              <button
                onClick={() => handleNavigate('admin-categories')}
                className={`px-2.5 py-1 rounded-md transition ${currentTab === 'admin-categories' ? 'bg-orange-500 text-white font-bold' : 'hover:bg-slate-700'}`}
              >
                Categories
              </button>
              <button
                onClick={() => handleNavigate('admin-brands')}
                className={`px-2.5 py-1 rounded-md transition ${currentTab === 'admin-brands' ? 'bg-orange-500 text-white font-bold' : 'hover:bg-slate-700'}`}
              >
                Brands
              </button>
              <button
                onClick={() => handleNavigate('admin-contact')}
                className={`px-2.5 py-1 rounded-md transition ${currentTab === 'admin-contact' ? 'bg-orange-500 text-white font-bold' : 'hover:bg-slate-700'}`}
              >
                Contact Info
              </button>
              <button
                onClick={() => handleNavigate('admin-profile')}
                className={`px-2.5 py-1 rounded-md transition ${currentTab === 'admin-profile' ? 'bg-orange-500 text-white font-bold' : 'hover:bg-slate-700'}`}
              >
                Admin Profile
              </button>
            </div>
          </div>
        )}

        {/* Main Body Content Router */}
        <main>
          {currentTab === 'home' && (
            <HomePage
              featuredProducts={featuredProducts}
              categories={categories}
              contactInfo={contactInfo}
              onNavigate={handleNavigate}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {currentTab === 'products' && (
            <ProductsPage
              products={products}
              totalProducts={totalProducts}
              currentPage={currentPage}
              totalPages={totalPages}
              categories={categories}
              brands={brands}
              filters={filters}
              contactInfo={contactInfo}
              onFilterChange={handleFilterChange}
              onFilterReset={handleFilterReset}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {currentTab === 'categories' && (
            <CategoriesPage
              categories={categories}
              onSelectCategory={(catId) => handleNavigate('products', { category_id: catId })}
            />
          )}

          {currentTab === 'about' && (
            <AboutPage
              contactInfo={contactInfo}
              onNavigateContact={() => handleNavigate('contact')}
            />
          )}

          {currentTab === 'contact' && (
            <ContactPage
              contactInfo={contactInfo}
            />
          )}

          {/* Admin Routes */}
          {currentTab === 'admin-login' && (
            <AdminLoginPage
              onLoginSuccess={() => handleNavigate('admin-dashboard')}
              onNavigateHome={() => handleNavigate('home')}
            />
          )}

          {currentTab === 'admin-dashboard' && (
            isAdmin ? (
              <AdminDashboardPage
                onNavigateTab={handleNavigate}
                onEditProduct={handleEditProductFromDashboard}
              />
            ) : (
              <AdminLoginPage
                onLoginSuccess={() => handleNavigate('admin-dashboard')}
                onNavigateHome={() => handleNavigate('home')}
              />
            )
          )}

          {currentTab === 'admin-products' && (
            isAdmin ? (
              <AdminProductsPage
                categories={categories}
                brands={brands}
                editingProduct={editingProduct}
                onClearEditingProduct={() => setEditingProduct(null)}
              />
            ) : (
              <AdminLoginPage
                onLoginSuccess={() => handleNavigate('admin-products')}
                onNavigateHome={() => handleNavigate('home')}
              />
            )
          )}

          {currentTab === 'admin-categories' && (
            isAdmin ? (
              <AdminCategoriesPage
                categories={categories}
                onRefresh={loadInitialData}
              />
            ) : (
              <AdminLoginPage
                onLoginSuccess={() => handleNavigate('admin-categories')}
                onNavigateHome={() => handleNavigate('home')}
              />
            )
          )}

          {currentTab === 'admin-brands' && (
            isAdmin ? (
              <AdminBrandsPage
                brands={brands}
                onRefresh={loadInitialData}
              />
            ) : (
              <AdminLoginPage
                onLoginSuccess={() => handleNavigate('admin-brands')}
                onNavigateHome={() => handleNavigate('home')}
              />
            )
          )}

          {currentTab === 'admin-contact' && (
            isAdmin ? (
              <AdminContactPage
                contactInfo={contactInfo}
                onRefresh={loadInitialData}
              />
            ) : (
              <AdminLoginPage
                onLoginSuccess={() => handleNavigate('admin-contact')}
                onNavigateHome={() => handleNavigate('home')}
              />
            )
          )}

          {currentTab === 'admin-profile' && (
            isAdmin ? (
              <AdminProfilePage />
            ) : (
              <AdminLoginPage
                onLoginSuccess={() => handleNavigate('admin-profile')}
                onNavigateHome={() => handleNavigate('home')}
              />
            )
          )}
        </main>
      </div>

      {/* Product Details Modal View */}
      <ProductDetailsModal
        product={selectedProduct}
        relatedProducts={relatedProducts}
        contactInfo={contactInfo}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={handleSelectProduct}
        onNavigateContact={() => {
          setSelectedProduct(null);
          handleNavigate('contact');
        }}
      />

      {/* Footer */}
      <Footer
        contactInfo={contactInfo}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
