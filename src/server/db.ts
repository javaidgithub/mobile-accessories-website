import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { DatabaseSync } from 'node:sqlite';
import { Category, Brand, Product, ContactInfo, AdminUser, DashboardStats, ProductFilterParams, PaginatedProducts } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'app.db');
const LEGACY_JSON_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_CONTACT_INFO: ContactInfo = {
  id: 1,
  shop_name: "Apex Mobile Tech & Accessories",
  owner_name: "Alex Sterling",
  phone: "+1 (555) 234-5678",
  whatsapp: "+15552345678",
  email: "contact@apexmobiletech.com",
  address: "742 Evergreen Terrace, Suite 104, Tech District, CA 90210",
  google_map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0192348123!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808e00000001%3A0x123456789abcdef!2sTech%20District!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
  facebook: "https://facebook.com/apexmobiletech",
  instagram: "https://instagram.com/apexmobiletech",
  tiktok: "https://tiktok.com/@apexmobiletech",
  business_hours: "Monday - Saturday: 9:00 AM - 8:00 PM | Sunday: 11:00 AM - 5:00 PM"
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "Mobile Covers", description: "Shockproof, slim, and designer cases for all flagship smartphones.", iconName: "Smartphone" },
  { id: 2, name: "Chargers", description: "Fast PD wall chargers, GaN adapters, and multi-port charging hubs.", iconName: "Zap" },
  { id: 3, name: "Data Cables", description: "High-speed braided USB-C, Lightning, and 240W power delivery cables.", iconName: "Cable" },
  { id: 4, name: "Power Banks", description: "High capacity portable battery packs and MagSafe magnetic power banks.", iconName: "BatteryCharging" },
  { id: 5, name: "Earphones", description: "High-fidelity wired earphones with mic and noise isolation.", iconName: "Headphones" },
  { id: 6, name: "Bluetooth Headsets", description: "True wireless earbuds (TWS) and over-ear active noise cancelling headphones.", iconName: "Volume2" },
  { id: 7, name: "Smart Watches", description: "Fitness trackers, AMOLED smartwatches, and stylish replacement straps.", iconName: "Watch" },
  { id: 8, name: "Screen Protectors", description: "9H tempered glass, privacy screens, and camera lens protectors.", iconName: "ShieldCheck" },
  { id: 9, name: "Phone Holders", description: "Magnetic car mounts, desk stands, and tripod phone holders.", iconName: "Maximize2" },
  { id: 10, name: "Car Chargers", description: "Dual-port high-speed car chargers with LED display and voltage monitor.", iconName: "Car" },
  { id: 11, name: "Mobile Stands", description: "Adjustable aluminum desk docks, lazy arm holders, and foldable stands.", iconName: "Layers" }
];

const DEFAULT_BRANDS: Brand[] = [
  { id: 1, name: "Anker" },
  { id: 2, name: "Spigen" },
  { id: 3, name: "Apple" },
  { id: 4, name: "Samsung" },
  { id: 5, name: "Baseus" },
  { id: 6, name: "Belkin" },
  { id: 7, name: "JBL" },
  { id: 8, name: "Xiaomi" },
  { id: 9, name: "OnePlus" },
  { id: 10, name: "Ugreen" }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1, category_id: 1, brand_id: 2,
    name: "Spigen Tough Armor Case for iPhone 15 Pro Max",
    description: "Military-grade extreme protection case featuring dual-layer technology with air cushion shocks and an integrated kickstand for hands-free viewing.",
    specifications: "Material: Polycarbonate + TPU\nProtection: MIL-STD 810G-516.6 certified\nSpecial Feature: Built-in Kickstand & Tactile Buttons\nCompatibility: iPhone 15 Pro Max (6.7-inch)",
    price: 34.99, stock_status: "in_stock",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80",
    additional_images: [
      "https://images.unsplash.com/photo-1541877944-ac82a091518a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80"
    ],
    created_at: "2026-07-01T10:00:00Z", updated_at: "2026-07-01T10:00:00Z"
  },
  {
    id: 2, category_id: 2, brand_id: 1,
    name: "Anker 737 GaNPrime 120W Fast Wall Charger",
    description: "Ultra-compact 3-port fast wall charger equipped with GaNPrime technology to charge laptops, tablets, and phones simultaneously.",
    specifications: "Ports: 2x USB-C, 1x USB-A\nTotal Output: 120W Max\nTechnology: GaNPrime, PowerIQ 4.0\nSafety: ActiveShield 2.0 temperature monitoring",
    price: 79.99, stock_status: "in_stock",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    additional_images: ["https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80"],
    created_at: "2026-07-03T11:20:00Z", updated_at: "2026-07-03T11:20:00Z"
  },
  {
    id: 3, category_id: 4, brand_id: 1,
    name: "Anker 622 Magnetic Battery (MagGo) 5000mAh",
    description: "Snap-on magnetic wireless portable charger with built-in foldable stand for iPhone 12/13/14/15 series.",
    specifications: "Capacity: 5000 mAh\nWireless Output: 7.5W\nCable: USB-C to USB-C included\nWeight: 142g",
    price: 49.99, stock_status: "in_stock",
    image: "https://images.unsplash.com/photo-1622445268465-84385d562b48?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    created_at: "2026-07-05T09:15:00Z", updated_at: "2026-07-05T09:15:00Z"
  },
  {
    id: 4, category_id: 6, brand_id: 7,
    name: "JBL Tune 230NC TWS True Wireless Earbuds",
    description: "Smart ambient Active Noise Cancelling earbuds with JBL Pure Bass Sound and up to 40 hours total battery life.",
    specifications: "Driver Size: 6mm\nBluetooth Version: 5.2\nBattery Life: 10 hrs + 30 hrs in case\nWater Resistance: IPX4 water & sweat resistant",
    price: 89.99, stock_status: "in_stock",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    additional_images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"],
    created_at: "2026-07-06T14:45:00Z", updated_at: "2026-07-06T14:45:00Z"
  },
  {
    id: 5, category_id: 3, brand_id: 10,
    name: "Ugreen 100W Nylon Braided USB-C to USB-C Cable (2m)",
    description: "Heavy-duty 100W Fast Charging braided cable with E-Marker smart chip for laptops, smartphones, and tablets.",
    specifications: "Length: 2 Meters (6.6 ft)\nMax Power: 20V/5A (100W)\nData Transfer: 480 Mbps\nDurability: 10,000+ bend lifespan",
    price: 15.99, stock_status: "in_stock",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    created_at: "2026-07-08T16:00:00Z", updated_at: "2026-07-08T16:00:00Z"
  },
  {
    id: 6, category_id: 7, brand_id: 4,
    name: "Samsung Galaxy Watch6 Classic 47mm Bluetooth",
    description: "Premium stainless steel smartwatch featuring the iconic rotating bezel, advanced sleep tracking, and HR monitoring.",
    specifications: "Display: 1.5-inch Super AMOLED (480x480)\nMaterial: Stainless Steel + Sapphire Crystal\nSensors: BioActive Sensor, ECG, BIA\nBattery: Up to 40 hours",
    price: 329.99, stock_status: "in_stock",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
    additional_images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"],
    created_at: "2026-07-10T08:30:00Z", updated_at: "2026-07-10T08:30:00Z"
  },
  {
    id: 7, category_id: 8, brand_id: 2,
    name: "Spigen EZ Fit Glass Guard for Galaxy S24 Ultra",
    description: "9H hardness tempered glass screen protector with auto-alignment tray for easy installation and zero air bubbles.",
    specifications: "Hardness: 9H Tempered Glass\nCoating: Oleophobic anti-fingerprint\nIncludes: 2 Screen Protectors + Alignment Kit",
    price: 19.99, stock_status: "in_stock",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    created_at: "2026-07-12T12:00:00Z", updated_at: "2026-07-12T12:00:00Z"
  },
  {
    id: 8, category_id: 9, brand_id: 5,
    name: "Baseus Magnetic Wireless Car Mount Phone Holder",
    description: "Dashboard & air vent 15W Qi fast charging magnetic car holder designed for iPhone MagSafe and universal phones.",
    specifications: "Mounting: Air Vent & Dashboard 3M Base\nWireless Output: 15W Max\nRotation: 360-degree ball joint",
    price: 29.99, stock_status: "in_stock",
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    created_at: "2026-07-15T15:20:00Z", updated_at: "2026-07-15T15:20:00Z"
  },
  {
    id: 9, category_id: 11, brand_id: 10,
    name: "Ugreen Foldable Desktop Aluminum Phone Stand",
    description: "Multi-angle adjustable metallic phone dock suitable for smartphones and tablets up to 7.9 inches.",
    specifications: "Material: Solid Aluminum Alloy + Silicone Pads\nAdjustment: 0 - 100 degrees\nFolded Thickness: 18mm",
    price: 14.99, stock_status: "in_stock",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    created_at: "2026-07-18T17:10:00Z", updated_at: "2026-07-18T17:10:00Z"
  },
  {
    id: 10, category_id: 10, brand_id: 6,
    name: "Belkin BOOSTCHARGE 37W Dual Car Charger",
    description: "Compact dual port car adapter featuring 25W USB-C Power Delivery and 12W USB-A for rapid charging on the go.",
    specifications: "USB-C Port: 25W PD Fast Charge\nUSB-A Port: 12W\nTotal Output: 37W\nIndicator: Soft LED light indicator",
    price: 24.99, stock_status: "out_of_stock",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    created_at: "2026-07-20T10:05:00Z", updated_at: "2026-07-20T10:05:00Z"
  },
  {
    id: 11, category_id: 5, brand_id: 3,
    name: "Apple EarPods with USB-C Connector",
    description: "Original Apple wired earphones with integrated remote control to adjust volume, control music playback, and answer calls.",
    specifications: "Connector: USB-C\nControls: In-line mic and volume buttons\nAudio: High-quality acoustic speakers with deep bass",
    price: 19.00, stock_status: "in_stock",
    image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    created_at: "2026-07-22T13:40:00Z", updated_at: "2026-07-22T13:40:00Z"
  },
  {
    id: 12, category_id: 1, brand_id: 5,
    name: "Baseus Liquid Silicone Magsafe Case for Galaxy S24",
    description: "Silky smooth soft-touch silicone protective shell with built-in magnetic ring and microfiber interior lining.",
    specifications: "Material: Liquid Silicone + Microfiber\nFeatures: MagSafe compatible ring, raised camera lip\nColor: Dark Slate Navy",
    price: 21.99, stock_status: "out_of_stock",
    image: "https://images.unsplash.com/photo-1533228876829-65c94e7b5025?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    created_at: "2026-07-25T14:00:00Z", updated_at: "2026-07-25T14:00:00Z"
  }
];

// Default admin credentials. Override via ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD
// env vars on first run (before data/app.db exists). The password is always stored hashed.
const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@apexmobiletech.com';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

class DatabaseWrapper {
  private conn: DatabaseSync;

  constructor() {
    this.conn = new DatabaseSync(DB_FILE);
    this.conn.exec('PRAGMA journal_mode = WAL');
    this.conn.exec('PRAGMA foreign_keys = ON');
    this.createSchema();
    this.seedIfEmpty();
  }

  private createSchema() {
    this.conn.exec(`
      CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        iconName TEXT DEFAULT 'Tag'
      );

      CREATE TABLE IF NOT EXISTS brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        logo TEXT
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE SET NULL,
        brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE SET NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        specifications TEXT NOT NULL DEFAULT '',
        price REAL NOT NULL DEFAULT 0,
        stock_status TEXT NOT NULL DEFAULT 'in_stock',
        image TEXT,
        additional_images TEXT NOT NULL DEFAULT '[]',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS contact_info (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        shop_name TEXT, owner_name TEXT, phone TEXT, whatsapp TEXT, email TEXT,
        address TEXT, google_map TEXT, facebook TEXT, instagram TEXT, tiktok TEXT,
        business_hours TEXT
      );
    `);
  }

  private seedIfEmpty() {
    const catCount = (this.conn.prepare('SELECT COUNT(*) as c FROM categories').get() as any).c;
    const brandCount = (this.conn.prepare('SELECT COUNT(*) as c FROM brands').get() as any).c;
    const productCount = (this.conn.prepare('SELECT COUNT(*) as c FROM products').get() as any).c;
    const adminCount = (this.conn.prepare('SELECT COUNT(*) as c FROM admin').get() as any).c;
    const contactCount = (this.conn.prepare('SELECT COUNT(*) as c FROM contact_info').get() as any).c;

    // Optional one-time migration from the legacy JSON store, if present.
    let legacy: any = null;
    if (fs.existsSync(LEGACY_JSON_FILE)) {
      try {
        legacy = JSON.parse(fs.readFileSync(LEGACY_JSON_FILE, 'utf-8'));
      } catch {
        legacy = null;
      }
    }

    const insertCat = this.conn.prepare('INSERT INTO categories (id, name, description, iconName) VALUES (?, ?, ?, ?)');
    const insertBrand = this.conn.prepare('INSERT INTO brands (id, name, logo) VALUES (?, ?, ?)');
    const insertProduct = this.conn.prepare(`
      INSERT INTO products (id, category_id, brand_id, name, description, specifications, price, stock_status, image, additional_images, created_at, updated_at)
      VALUES (@id, @category_id, @brand_id, @name, @description, @specifications, @price, @stock_status, @image, @additional_images, @created_at, @updated_at)
    `);

    if (catCount === 0) {
      const source: Category[] = legacy?.categories || DEFAULT_CATEGORIES;
      this.conn.exec('BEGIN');
      try {
        for (const c of source) insertCat.run(c.id, c.name, c.description, c.iconName || 'Tag');
        this.conn.exec('COMMIT');
      } catch (e) {
        this.conn.exec('ROLLBACK');
        throw e;
      }
    }

    if (brandCount === 0) {
      const source: Brand[] = legacy?.brands || DEFAULT_BRANDS;
      this.conn.exec('BEGIN');
      try {
        for (const b of source) insertBrand.run(b.id, b.name, b.logo || null);
        this.conn.exec('COMMIT');
      } catch (e) {
        this.conn.exec('ROLLBACK');
        throw e;
      }
    }

    if (productCount === 0) {
      const source: Product[] = legacy?.products || DEFAULT_PRODUCTS;
      this.conn.exec('BEGIN');
      try {
        for (const p of source) {
          insertProduct.run({
            id: p.id,
            category_id: p.category_id,
            brand_id: p.brand_id,
            name: p.name,
            description: p.description,
            specifications: p.specifications,
            price: p.price,
            stock_status: p.stock_status,
            image: p.image,
            additional_images: JSON.stringify(p.additional_images || []),
            created_at: p.created_at,
            updated_at: p.updated_at
          });
        }
        this.conn.exec('COMMIT');
      } catch (e) {
        this.conn.exec('ROLLBACK');
        throw e;
      }
    }

    if (contactCount === 0) {
      const c: ContactInfo = legacy?.contact_info || DEFAULT_CONTACT_INFO;
      this.conn.prepare(`
        INSERT INTO contact_info (id, shop_name, owner_name, phone, whatsapp, email, address, google_map, facebook, instagram, tiktok, business_hours)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(c.shop_name, c.owner_name, c.phone, c.whatsapp, c.email, c.address, c.google_map, c.facebook, c.instagram, c.tiktok, c.business_hours);
    }

    if (adminCount === 0) {
      // If a legacy plaintext password exists, hash it once during migration.
      // Otherwise fall back to the configured/default admin credentials.
      const legacyPassword = legacy?.admin?.password_hash;
      const username = legacy?.admin?.username || DEFAULT_ADMIN_USERNAME;
      const email = legacy?.admin?.email || DEFAULT_ADMIN_EMAIL;
      const passwordToHash = legacyPassword || DEFAULT_ADMIN_PASSWORD;
      const hash = bcrypt.hashSync(passwordToHash, 12);
      this.conn.prepare('INSERT INTO admin (id, username, email, password_hash) VALUES (1, ?, ?, ?)').run(username, email, hash);
    }
  }

  private rowToProduct(row: any): Product {
    return {
      id: row.id,
      category_id: row.category_id,
      brand_id: row.brand_id,
      name: row.name,
      description: row.description,
      specifications: row.specifications,
      price: row.price,
      stock_status: row.stock_status,
      image: row.image,
      additional_images: row.additional_images ? JSON.parse(row.additional_images) : [],
      created_at: row.created_at,
      updated_at: row.updated_at,
      category_name: row.category_name,
      brand_name: row.brand_name
    };
  }

  // --- ADMIN ---
  getAdmin(): AdminUser {
    const row = this.conn.prepare('SELECT id, username, email FROM admin WHERE id = 1').get() as unknown as AdminUser;
    return row;
  }

  validateAdmin(username: string, pass: string): boolean {
    const row = this.conn.prepare('SELECT username, email, password_hash FROM admin WHERE id = 1').get() as any;
    if (!row) return false;
    if (row.username !== username && row.email !== username) return false;
    return bcrypt.compareSync(pass, row.password_hash);
  }

  updateAdmin(username: string, email: string, newPassword?: string): AdminUser {
    if (newPassword && newPassword.trim() !== '') {
      const hash = bcrypt.hashSync(newPassword, 12);
      this.conn.prepare('UPDATE admin SET username = ?, email = ?, password_hash = ? WHERE id = 1').run(username, email, hash);
    } else {
      this.conn.prepare('UPDATE admin SET username = ?, email = ? WHERE id = 1').run(username, email);
    }
    return this.getAdmin();
  }

  // --- CATEGORIES ---
  getCategories(): Category[] {
    const rows = this.conn.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as product_count
      FROM categories c ORDER BY c.id
    `).all();
    return rows as unknown as Category[];
  }

  getCategoryById(id: number): Category | undefined {
    const row = this.conn.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as product_count
      FROM categories c WHERE c.id = ?
    `).get(id);
    return row as unknown as Category | undefined;
  }

  addCategory(name: string, description: string, iconName?: string): Category {
    const info = this.conn.prepare('INSERT INTO categories (name, description, iconName) VALUES (?, ?, ?)').run(name, description, iconName || 'Tag');
    return this.getCategoryById(Number(info.lastInsertRowid))!;
  }

  updateCategory(id: number, name: string, description: string, iconName?: string): Category | null {
    const existing = this.conn.prepare('SELECT id FROM categories WHERE id = ?').get(id);
    if (!existing) return null;
    if (iconName) {
      this.conn.prepare('UPDATE categories SET name = ?, description = ?, iconName = ? WHERE id = ?').run(name, description, iconName, id);
    } else {
      this.conn.prepare('UPDATE categories SET name = ?, description = ? WHERE id = ?').run(name, description, id);
    }
    return this.getCategoryById(id)!;
  }

  deleteCategory(id: number): boolean {
    const info = this.conn.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return info.changes > 0;
  }

  // --- BRANDS ---
  getBrands(): Brand[] {
    const rows = this.conn.prepare(`
      SELECT b.*, (SELECT COUNT(*) FROM products p WHERE p.brand_id = b.id) as product_count
      FROM brands b ORDER BY b.id
    `).all();
    return rows as unknown as Brand[];
  }

  getBrandById(id: number): Brand | undefined {
    const row = this.conn.prepare(`
      SELECT b.*, (SELECT COUNT(*) FROM products p WHERE p.brand_id = b.id) as product_count
      FROM brands b WHERE b.id = ?
    `).get(id);
    return row as unknown as Brand | undefined;
  }

  addBrand(name: string, logo?: string): Brand {
    const info = this.conn.prepare('INSERT INTO brands (name, logo) VALUES (?, ?)').run(name, logo || null);
    return this.getBrandById(Number(info.lastInsertRowid))!;
  }

  updateBrand(id: number, name: string, logo?: string): Brand | null {
    const existing = this.conn.prepare('SELECT id FROM brands WHERE id = ?').get(id);
    if (!existing) return null;
    if (logo !== undefined) {
      this.conn.prepare('UPDATE brands SET name = ?, logo = ? WHERE id = ?').run(name, logo, id);
    } else {
      this.conn.prepare('UPDATE brands SET name = ? WHERE id = ?').run(name, id);
    }
    return this.getBrandById(id)!;
  }

  deleteBrand(id: number): boolean {
    const info = this.conn.prepare('DELETE FROM brands WHERE id = ?').run(id);
    return info.changes > 0;
  }

  // --- PRODUCTS ---
  getProducts(params: ProductFilterParams = {}): PaginatedProducts {
    const where: string[] = [];
    const args: any[] = [];

    if (params.search && params.search.trim() !== '') {
      const q = `%${params.search.trim().toLowerCase()}%`;
      where.push('(LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ? OR LOWER(b.name) LIKE ? OR LOWER(c.name) LIKE ?)');
      args.push(q, q, q, q);
    }
    if (params.category_id && params.category_id !== 'all') {
      const catId = Number(params.category_id);
      if (!isNaN(catId)) { where.push('p.category_id = ?'); args.push(catId); }
    }
    if (params.brand_id && params.brand_id !== 'all') {
      const bId = Number(params.brand_id);
      if (!isNaN(bId)) { where.push('p.brand_id = ?'); args.push(bId); }
    }
    if (params.min_price !== undefined && !isNaN(params.min_price)) {
      where.push('p.price >= ?'); args.push(Number(params.min_price));
    }
    if (params.max_price !== undefined && !isNaN(params.max_price)) {
      where.push('p.price <= ?'); args.push(Number(params.max_price));
    }
    if (params.stock_status && params.stock_status !== 'all') {
      where.push('p.stock_status = ?'); args.push(params.stock_status);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    let orderSql = 'ORDER BY p.created_at DESC';
    switch (params.sort_by) {
      case 'price_asc': orderSql = 'ORDER BY p.price ASC'; break;
      case 'price_desc': orderSql = 'ORDER BY p.price DESC'; break;
      case 'name_asc': orderSql = 'ORDER BY p.name ASC'; break;
      case 'newest': default: orderSql = 'ORDER BY p.created_at DESC'; break;
    }

    const total = (this.conn.prepare(`
      SELECT COUNT(*) as c FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN brands b ON b.id = p.brand_id
      ${whereSql}
    `).get(...args) as any).c;

    const page = params.page && params.page > 0 ? Number(params.page) : 1;
    const limit = params.limit && params.limit > 0 ? Number(params.limit) : 9;
    const total_pages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;

    const rows = this.conn.prepare(`
      SELECT p.*, c.name as category_name, b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN brands b ON b.id = p.brand_id
      ${whereSql}
      ${orderSql}
      LIMIT ? OFFSET ?
    `).all(...args, limit, offset);

    return {
      products: rows.map((r) => this.rowToProduct(r)),
      total,
      page,
      total_pages
    };
  }

  getProductById(id: number): Product | undefined {
    const row = this.conn.prepare(`
      SELECT p.*, c.name as category_name, b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN brands b ON b.id = p.brand_id
      WHERE p.id = ?
    `).get(id);
    return row ? this.rowToProduct(row) : undefined;
  }

  addProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    const now = new Date().toISOString();
    const info = this.conn.prepare(`
      INSERT INTO products (category_id, brand_id, name, description, specifications, price, stock_status, image, additional_images, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      productData.category_id,
      productData.brand_id,
      productData.name,
      productData.description,
      productData.specifications,
      productData.price,
      productData.stock_status,
      productData.image,
      JSON.stringify(productData.additional_images || []),
      now,
      now
    );
    return this.getProductById(Number(info.lastInsertRowid))!;
  }

  updateProduct(id: number, productData: Partial<Omit<Product, 'id' | 'created_at'>>): Product | null {
    const existing = this.getProductById(id);
    if (!existing) return null;

    const merged = { ...existing, ...productData };
    this.conn.prepare(`
      UPDATE products SET
        category_id = ?, brand_id = ?, name = ?, description = ?, specifications = ?,
        price = ?, stock_status = ?, image = ?, additional_images = ?, updated_at = ?
      WHERE id = ?
    `).run(
      merged.category_id,
      merged.brand_id,
      merged.name,
      merged.description,
      merged.specifications,
      merged.price,
      merged.stock_status,
      merged.image,
      JSON.stringify(merged.additional_images || []),
      new Date().toISOString(),
      id
    );
    return this.getProductById(id)!;
  }

  deleteProduct(id: number): boolean {
    const info = this.conn.prepare('DELETE FROM products WHERE id = ?').run(id);
    return info.changes > 0;
  }

  // --- DASHBOARD STATS ---
  getDashboardStats(): DashboardStats {
    const total_products = (this.conn.prepare('SELECT COUNT(*) as c FROM products').get() as any).c;
    const total_categories = (this.conn.prepare('SELECT COUNT(*) as c FROM categories').get() as any).c;
    const total_brands = (this.conn.prepare('SELECT COUNT(*) as c FROM brands').get() as any).c;
    const products_in_stock = (this.conn.prepare("SELECT COUNT(*) as c FROM products WHERE stock_status = 'in_stock'").get() as any).c;
    const products_out_of_stock = (this.conn.prepare("SELECT COUNT(*) as c FROM products WHERE stock_status = 'out_of_stock'").get() as any).c;

    return { total_products, total_categories, total_brands, products_in_stock, products_out_of_stock };
  }

  // --- CONTACT INFO ---
  getContactInfo(): ContactInfo {
    return this.conn.prepare('SELECT * FROM contact_info WHERE id = 1').get() as unknown as ContactInfo;
  }

  updateContactInfo(info: Partial<ContactInfo>): ContactInfo {
    const current = this.getContactInfo();
    const merged = { ...current, ...info, id: 1 };
    this.conn.prepare(`
      UPDATE contact_info SET
        shop_name = ?, owner_name = ?, phone = ?, whatsapp = ?, email = ?, address = ?,
        google_map = ?, facebook = ?, instagram = ?, tiktok = ?, business_hours = ?
      WHERE id = 1
    `).run(
      merged.shop_name, merged.owner_name, merged.phone, merged.whatsapp, merged.email,
      merged.address, merged.google_map, merged.facebook, merged.instagram, merged.tiktok, merged.business_hours
    );
    return this.getContactInfo();
  }
}

export const db = new DatabaseWrapper();
