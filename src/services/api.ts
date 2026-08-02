import { Product, Category, Brand, ContactInfo, DashboardStats, ProductFilterParams, PaginatedProducts, AdminUser } from '../types';

const API_BASE = '/api';

const TOKEN_STORAGE_KEY = 'apex_admin_token';

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

export async function fetchProducts(params: ProductFilterParams = {}): Promise<PaginatedProducts> {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category_id && params.category_id !== 'all') query.append('category_id', String(params.category_id));
  if (params.brand_id && params.brand_id !== 'all') query.append('brand_id', String(params.brand_id));
  if (params.min_price !== undefined) query.append('min_price', String(params.min_price));
  if (params.max_price !== undefined) query.append('max_price', String(params.max_price));
  if (params.stock_status && params.stock_status !== 'all') query.append('stock_status', params.stock_status);
  if (params.sort_by) query.append('sort_by', params.sort_by);
  if (params.page) query.append('page', String(params.page));
  if (params.limit) query.append('limit', String(params.limit));

  const res = await fetch(`${API_BASE}/products?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create product');
  }
  return res.json();
}

export async function updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update product');
  }
  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to delete product');
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(data: { name: string; description?: string; iconName?: string }): Promise<Category> {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function updateCategory(id: number, data: { name: string; description?: string; iconName?: string }): Promise<Category> {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to delete category');
}

// Brands
export async function fetchBrands(): Promise<Brand[]> {
  const res = await fetch(`${API_BASE}/brands`);
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
}

export async function createBrand(data: { name: string; logo?: string }): Promise<Brand> {
  const res = await fetch(`${API_BASE}/brands`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create brand');
  return res.json();
}

export async function updateBrand(id: number, data: { name: string; logo?: string }): Promise<Brand> {
  const res = await fetch(`${API_BASE}/brands/${id}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update brand');
  return res.json();
}

export async function deleteBrand(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/brands/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to delete brand');
}

// Contact Info
export async function fetchContactInfo(): Promise<ContactInfo> {
  const res = await fetch(`${API_BASE}/contact`);
  if (!res.ok) throw new Error('Failed to fetch contact information');
  return res.json();
}

export async function updateContactInfo(data: Partial<ContactInfo>): Promise<ContactInfo> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update contact info');
  const resData = await res.json();
  return resData.data;
}

// Dashboard Stats
export async function fetchAdminStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/admin/stats`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
}

// Admin profile
export async function fetchAdminMe(): Promise<{ user: AdminUser }> {
  const res = await fetch(`${API_BASE}/admin/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch admin profile');
  return res.json();
}

export async function updateAdminProfile(data: { username: string; email: string; newPassword?: string }): Promise<{ user: AdminUser }> {
  const res = await fetch(`${API_BASE}/admin/profile`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update profile');
  }
  return res.json();
}

// Image upload
export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Image upload failed' }));
    throw new Error(err.error || 'Image upload failed');
  }
  const data = await res.json();
  return data.url;
}
