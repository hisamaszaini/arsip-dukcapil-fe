# 💻 Arsip Dukcapil – Frontend (React + Vite)

<p align="center">
  <a href="https://vitejs.dev" target="_blank">
    <img src="https://vitejs.dev/logo.svg" width="100" alt="Vite Logo" />
  </a>
  <a href="https://react.dev" target="_blank">
    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="100" alt="React Logo" />
  </a>
</p>

<p align="center">
  Frontend aplikasi Arsip Dukcapil yang dibangun menggunakan <strong>React</strong>, <strong>TypeScript</strong>, dan <strong>Vite</strong>.
  Aplikasi ini menyediakan antarmuka modern dan responsif untuk pengelolaan arsip kependudukan.
</p>

---

# 🚀 Teknologi yang Digunakan

- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/) (Super fast build & HMR)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management & Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (Schema Validation)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **UI Components:** [Lucide React](https://lucide.dev/) (Icons), [Sonner](https://sonner.emilkowal.ski/) (Toast Notifications)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Charts:** [Chart.js](https://www.chartjs.org/) + [React Chartjs 2](https://react-chartjs-2.js.org/)

---

# 🛠️ Panduan Instalasi & Setup

## 1️⃣ Prasyarat

Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (v18 atau lebih baru)
- Backend API sudah berjalan (lihat panduan di folder `backend/`)

## 2️⃣ Clone Repository

(Jika belum dilakukan)

```bash
git clone https://github.com/hisamaszaini/arsip-dukcapil-be/
cd arsip-dukcapil-be/frontend
```

## 3️⃣ Install Dependencies

```bash
npm install
```

## 4️⃣ Konfigurasi Environment (.env)

Buat file `.env` di root folder `frontend` dan sesuaikan dengan URL backend Anda:

```bash
VITE_API_URL=http://localhost:3334
```

> **Catatan:** Pastikan port sesuai dengan konfigurasi backend Anda (default: 3334).

## 5️⃣ Menjalankan Aplikasi

### Development Mode
Untuk menjalankan server development dengan Hot Module Replacement (HMR):

```bash
npm run dev
```
Akses aplikasi di: `http://localhost:5173`

### Production Build
Untuk mem-build aplikasi agar siap deploy:

```bash
npm run build
```
Hasil build akan berada di folder `dist/`.

To preview the build:
```bash
npm run preview
```

---

# � Deployment (Production)

Karena ini adalah Single Page Application (SPA), Anda perlu mengonfigurasi web server untuk mengarahkan semua request ke `index.html`.

## 1️⃣ Nginx

Buat konfigurasi server block (misal: `/etc/nginx/sites-available/arsip-dukcapil`):

```nginx
server {
    listen 80;
    server_name arsip.example.com;

    root /var/www/arsip-dukcapil/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

## 2️⃣ Apache2

Pastikan modul `rewrite` aktif:
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

Buat file `.htaccess` di dalam folder `dist/` (atau konfigurasi di VirtualHost):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

# �📌 Fitur Aplikasi

### 🗂️ Manajemen Kategori Dinamis
- **Dynamic Forms:** Form input arsip otomatis menyesuaikan dengan konfigurasi kategori yang dibuat di backend (Label, Validasi, Masking).
- **Master Data Kategori:** UI untuk membuat dan mengedit jenis arsip beserta aturan validasinya.

### 📄 Manajemen Arsip
- **CRUD Arsip:** Tambah, Edit, Hapus, dan Lihat detail arsip.
- **Multi-File Upload:** Upload banyak file sekaligus dengan progress bar.
- **Pencarian & Filter:**
  - Pencarian global.
  - Filter berdasarkan rentang tanggal.
  - Filter berdasarkan kategori.

### 🔐 Autentikasi & Keamanan
- **Login System:** JWT-based authentication.
- **Role-Based Access:**
  - **Admin:** Akses penuh ke semua menu termasuk manajemen user dan kategori.
  - **Operator:** Akses terbatas pada pengelolaan arsip.
- **Auto Logout:** Token refresh otomatis dan logout jika sesi habis.

### 📊 Dashboard Interaktif
- Visualisasi data statistik arsip menggunakan grafik.
- Ringkasan jumlah arsip per kategori.

### 📱 Responsive Design
- Tampilan optimal di Desktop, Tablet, dan Mobile.
- Sidebar navigasi yang adaptif.

---

# 📁 Struktur Folder

```
frontend/
├── public/              # Aset statis
├── src/
│   ├── assets/          # Gambar, font, dll
│   ├── components/      # Komponen UI reusable (Button, Input, Modal, dll)
│   ├── hooks/           # Custom React Hooks (useAuth, useArsip, dll)
│   ├── layouts/         # Layout halaman (MainLayout, AuthLayout)
│   ├── pages/           # Halaman utama aplikasi (Dashboard, Login, Arsip)
│   ├── services/        # API calls (Axios instances)
│   ├── types/           # TypeScript interfaces & types
│   ├── utils/           # Fungsi helper/utility
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Entry point
├── .env                 # Environment variables
├── index.html           # HTML entry point
├── tailwind.config.js   # Konfigurasi Tailwind CSS
├── tsconfig.json        # Konfigurasi TypeScript
└── vite.config.ts       # Konfigurasi Vite
```
