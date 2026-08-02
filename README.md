# Apex Mobile Tech & Accessories — Website

A full-stack e-commerce storefront for a mobile accessories shop, with a public catalog (products, categories, brands, contact info) and a JWT-protected admin panel for managing everything.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | Express (TypeScript) |
| Database | SQLite via Node's built-in `node:sqlite` module (no native binary to compile/install) |
| Auth | JWT (`jsonwebtoken`) + bcrypt password hashing |
| File uploads | Multer, restricted to JPEG/PNG/WEBP/GIF |

## Features

- **Storefront:** browse products by category/brand, search, filter by price/stock, sort, pagination, contact page with shop info.
- **Admin panel:** login, dashboard stats, full CRUD on products/categories/brands, contact info editor, image uploads, and an admin profile page (change username/email/password).
- **Security:** every admin write operation requires a valid signed JWT; passwords are bcrypt-hashed; uploads are type-restricted; CORS is locked to configured origins in production.

## Project structure

```
├── server.ts                    # Express app: all /api/* routes, static + upload serving
├── src/
│   ├── server/
│   │   ├── db.ts                # SQLite data layer (node:sqlite)
│   │   └── auth.ts              # JWT signing + requireAdminAuth middleware
│   ├── services/api.ts          # Frontend API client (attaches auth headers automatically)
│   ├── context/AuthContext.tsx  # Frontend auth/session state
│   ├── pages/                    # Public + admin pages
│   ├── components/               # Shared UI components
│   └── types/                    # Shared TypeScript types
├── data/                         # SQLite database file lives here (git-ignored)
├── public/uploads/               # Uploaded product images (git-ignored)
├── .env.example                  # Template for required environment variables
└── package.json
```

## Prerequisites

- **Node.js 22.5 or newer** (this project uses Node's built-in `node:sqlite` module — no native module compilation required, so there's nothing extra to install for the database). Check your version:
  ```bash
  node -v
  ```
- On some Node 22.x builds, `node:sqlite` is still behind a flag — `npm run dev` and `npm start` already include `--experimental-sqlite` automatically, so you don't need to add it yourself.

## Getting started (local development)

1. **Install dependencies:**
   ```bash
   npm install
   ```
   If your npm blocks install scripts and shows a warning like `X packages have install scripts not yet covered by allowScripts`, approve them (they're normal build steps for `esbuild`, `protobufjs`, etc.):
   ```bash
   npm approve-scripts esbuild
   npm approve-scripts protobufjs
   npm approve-scripts @google/genai
   npm install
   ```

2. **Create your environment file:**
   ```bash
   cp .env.example .env
   ```
   Then fill in `.env` — see [Environment variables](#environment-variables) below for what each value means. At minimum you must set `JWT_SECRET` and a real `ADMIN_PASSWORD`; the server refuses to start without `JWT_SECRET`.

3. **Run the dev server:**
   ```bash
   npm run dev
   ```
   Open the URL shown in the terminal (e.g. `http://localhost:5173`).

4. **Log into the admin panel** at `/admin` using the `ADMIN_USERNAME` / `ADMIN_PASSWORD` you set in `.env` (only used the very first time the database is created — see below).

## Environment variables

| Variable | Required? | Description |
|---|---|---|
| `JWT_SECRET` | **Yes** | Long random string used to sign admin login tokens. Generate one with `openssl rand -hex 32`. The server won't start without this. |
| `ADMIN_USERNAME` | No (defaults to `admin`) | Admin login name — only used the **first time** `data/app.db` is created. |
| `ADMIN_EMAIL` | No | Admin email — same first-run-only behavior. |
| `ADMIN_PASSWORD` | No (has an insecure default — **change it**) | Admin password — same first-run-only behavior. Change credentials afterward from the Admin → Profile page in the app, not by editing `.env`. |
| `ALLOWED_ORIGINS` | No | Comma-separated list of origins allowed to call the API in production (CORS), e.g. `https://yourdomain.com`. Leave blank for local development (all origins allowed for convenience). |
| `GEMINI_API_KEY`, `APP_URL` | No | Leftover from the original AI Studio scaffold; not used by any code in this project. Safe to ignore. |

## Data storage

- Product/category/brand/contact/admin data lives in a SQLite database at `data/app.db` (created automatically on first run, WAL mode). It's git-ignored — don't commit it.
- Uploaded product images are written to `public/uploads/` (also git-ignored).
- You'll see `(node:xxxx) ExperimentalWarning: SQLite is an experimental feature...` printed on startup — this is expected and harmless, just Node labeling this still-newish built-in module.
- If you have an old `data/db.json` from a previous version of this project sitting in `data/`, it's automatically migrated into SQLite on first run (including a one-time hash of any legacy plaintext admin password).

## Building for production

```bash
npm run build   # builds the frontend (Vite) and bundles the server (esbuild)
npm start        # runs the built server from dist/
```

## Admin panel security notes

- Login (`POST /api/admin/login`) issues a signed JWT (2-hour expiry).
- Every admin-only endpoint (product/category/brand writes, contact updates, dashboard stats, profile updates, image uploads) requires `Authorization: Bearer <token>` and returns `401` without it.
- Passwords are bcrypt-hashed — never stored or sent in plain text after initial setup.
- Image uploads are restricted to JPEG/PNG/WEBP/GIF (checked by both file extension and MIME type), max 5MB.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `Error: JWT_SECRET is not set` | You haven't created `.env` yet, or it's misnamed. Must be exactly `.env` in the project root. |
| Login fails with credentials you just set in `.env` | `ADMIN_PASSWORD` (etc.) only takes effect the very first time `data/app.db` is created. Delete `data/app.db*` and restart to reseed, or change the password from the Admin → Profile page instead. |
| `Unknown built-in module: node:sqlite` | Your Node version needs the `--experimental-sqlite` flag — already baked into `npm run dev` / `npm start`, so make sure you're using those scripts rather than calling `node`/`tsx` directly. |
| VS Code shows lots of "implicitly has an `any` type" / JSX errors | Missing `@types/react` / `@types/react-dom` — run `npm install` again after pulling the latest `package.json`, then reload the VS Code window. |
| Changing password in Admin → Profile seems to do nothing | Make sure "Confirm New Password" is filled in and matches exactly — the form now shows inline red-border feedback if it doesn't. |

## Deployment

In short: set the same environment variables on your host, ensure `data/` and `public/uploads/` are on **persistent** storage (not wiped between deploys), then run `npm run build` followed by `npm start`.