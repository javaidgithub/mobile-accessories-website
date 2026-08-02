import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db';
import { requireAdminAuth, signAdminToken } from './src/server/auth';

const app = express();
const DEFAULT_PORT = 3000;

// Comma-separated list of allowed origins, e.g. "https://example.com,https://admin.example.com"
// Falls back to APP_URL (set automatically in some hosting environments).
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.APP_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

function getRuntimeMode() {
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }

  const startedFile = path.basename(process.argv[1] || '');
  return startedFile === 'server.cjs' ? 'production' : 'development';
}

function getPort() {
  const configuredPort = Number(process.env.PORT || DEFAULT_PORT);
  return Number.isFinite(configuredPort) ? configuredPort : DEFAULT_PORT;
}

function startServer(port: number, attempt = 0) {
  const candidatePorts = process.env.PORT
    ? [getPort()]
    : Array.from({ length: 10 }, (_value, index) => getPort() + index);

  const targetPort = candidatePorts[attempt];
  if (!targetPort) {
    console.error(`Unable to find an available port after trying ${candidatePorts.length} candidates.`);
    process.exit(1);
    return;
  }

  const server = app.listen(targetPort, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${targetPort}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE' && !process.env.PORT && attempt < candidatePorts.length - 1) {
      console.warn(`Port ${targetPort} is already in use. Retrying on ${candidatePorts[attempt + 1]}...`);
      startServer(getPort(), attempt + 1);
      return;
    }

    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${targetPort} is already in use. Stop the existing process or set PORT to a different value.`);
    } else {
      console.error(error);
    }
    process.exit(1);
  });
}

app.use(cors({
  // In development (no ALLOWED_ORIGINS/APP_URL configured), allow any origin so
  // the Vite dev server works out of the box. In production, only allow the
  // configured origin(s) — set ALLOWED_ORIGINS in your .env file.
  origin: allowedOrigins.length > 0 ? allowedOrigins : (process.env.NODE_ENV === 'production' ? false : true)
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype) || !ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
      cb(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed.'));
      return;
    }
    cb(null, true);
  }
});

// Serve static uploads
app.use('/uploads', express.static(uploadDir));

// ======================= API ROUTES =======================

// 1. Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Admin Auth API
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const isValid = db.validateAdmin(username, password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const user = db.getAdmin();
  const token = signAdminToken(user);
  return res.json({ token, user });
});

app.get('/api/admin/me', requireAdminAuth, (_req, res) => {
  const user = db.getAdmin();
  res.json({ user });
});

app.put('/api/admin/profile', requireAdminAuth, (req, res) => {
  const { username, email, newPassword } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required.' });
  }
  const updatedUser = db.updateAdmin(username, email, newPassword);
  res.json({ message: 'Profile updated successfully', user: updatedUser });
});

// 3. Admin Dashboard Stats
app.get('/api/admin/stats', requireAdminAuth, (_req, res) => {
  const stats = db.getDashboardStats();
  res.json(stats);
});

// 4. Products API
app.get('/api/products', (req, res) => {
  const params = {
    search: req.query.search as string,
    category_id: req.query.category_id as string,
    brand_id: req.query.brand_id as string,
    min_price: req.query.min_price ? Number(req.query.min_price) : undefined,
    max_price: req.query.max_price ? Number(req.query.max_price) : undefined,
    stock_status: req.query.stock_status as string,
    sort_by: req.query.sort_by as any,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 9
  };

  const result = db.getProducts(params);
  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = db.getProductById(id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', requireAdminAuth, (req, res) => {
  const { name, category_id, brand_id, price, description, specifications, stock_status, image, additional_images } = req.body;
  if (!name || !category_id || !brand_id || price === undefined) {
    return res.status(400).json({ error: 'Name, Category, Brand, and Price are required fields.' });
  }

  const newProduct = db.addProduct({
    name,
    category_id: Number(category_id),
    brand_id: Number(brand_id),
    price: Number(price),
    description: description || '',
    specifications: specifications || '',
    stock_status: stock_status || 'in_stock',
    image: image || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    additional_images: Array.isArray(additional_images) ? additional_images : []
  });

  res.status(201).json(newProduct);
});

app.put('/api/products/:id', requireAdminAuth, (req, res) => {
  const id = Number(req.params.id);
  const updated = db.updateProduct(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(updated);
});

app.delete('/api/products/:id', requireAdminAuth, (req, res) => {
  const id = Number(req.params.id);
  const deleted = db.deleteProduct(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ message: 'Product deleted successfully', id });
});

// 5. Categories API
app.get('/api/categories', (_req, res) => {
  res.json(db.getCategories());
});

app.get('/api/categories/:id', (req, res) => {
  const cat = db.getCategoryById(Number(req.params.id));
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  res.json(cat);
});

app.post('/api/categories', requireAdminAuth, (req, res) => {
  const { name, description, iconName } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });
  const cat = db.addCategory(name, description || '', iconName);
  res.status(201).json(cat);
});

app.put('/api/categories/:id', requireAdminAuth, (req, res) => {
  const { name, description, iconName } = req.body;
  const updated = db.updateCategory(Number(req.params.id), name, description, iconName);
  if (!updated) return res.status(404).json({ error: 'Category not found' });
  res.json(updated);
});

app.delete('/api/categories/:id', requireAdminAuth, (req, res) => {
  const deleted = db.deleteCategory(Number(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Category not found' });
  res.json({ message: 'Category deleted', id: Number(req.params.id) });
});

// 6. Brands API
app.get('/api/brands', (_req, res) => {
  res.json(db.getBrands());
});

app.get('/api/brands/:id', (req, res) => {
  const brand = db.getBrandById(Number(req.params.id));
  if (!brand) return res.status(404).json({ error: 'Brand not found' });
  res.json(brand);
});

app.post('/api/brands', requireAdminAuth, (req, res) => {
  const { name, logo } = req.body;
  if (!name) return res.status(400).json({ error: 'Brand name is required' });
  const brand = db.addBrand(name, logo);
  res.status(201).json(brand);
});

app.put('/api/brands/:id', requireAdminAuth, (req, res) => {
  const { name, logo } = req.body;
  const updated = db.updateBrand(Number(req.params.id), name, logo);
  if (!updated) return res.status(404).json({ error: 'Brand not found' });
  res.json(updated);
});

app.delete('/api/brands/:id', requireAdminAuth, (req, res) => {
  const deleted = db.deleteBrand(Number(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Brand not found' });
  res.json({ message: 'Brand deleted', id: Number(req.params.id) });
});

// 7. Contact Info API
app.get('/api/contact', (_req, res) => {
  res.json(db.getContactInfo());
});

app.put('/api/contact', requireAdminAuth, (req, res) => {
  const updated = db.updateContactInfo(req.body);
  res.json({ message: 'Contact information updated successfully', data: updated });
});

// 8. Image Upload Endpoint
app.post('/api/upload', requireAdminAuth, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl, filename: req.file.filename });
  });
});

// ======================= VITE / STATIC SERVING =======================

async function start() {
  const runtimeMode = getRuntimeMode();

  if (runtimeMode === 'development') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = getPort();
  startServer(port);
}

start();
