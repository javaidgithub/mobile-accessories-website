export type StockStatus = 'in_stock' | 'out_of_stock';

export interface Category {
  id: number;
  name: string;
  description: string;
  iconName?: string;
  product_count?: number;
}

export interface Brand {
  id: number;
  name: string;
  logo?: string;
  product_count?: number;
}

export interface Product {
  id: number;
  category_id: number;
  brand_id: number;
  name: string;
  description: string;
  specifications: string; // JSON string or line-separated key:value
  price: number;
  stock_status: StockStatus;
  image: string;
  additional_images?: string[];
  created_at: string;
  updated_at: string;

  // Joined fields for easy display
  category_name?: string;
  brand_name?: string;
}

export interface ContactInfo {
  id: number;
  shop_name: string;
  owner_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  google_map: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  business_hours: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
}

export interface DashboardStats {
  total_products: number;
  total_categories: number;
  total_brands: number;
  products_in_stock: number;
  products_out_of_stock: number;
}

export interface ProductFilterParams {
  search?: string;
  category_id?: number | string;
  brand_id?: number | string;
  min_price?: number;
  max_price?: number;
  stock_status?: string;
  sort_by?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  total_pages: number;
}
