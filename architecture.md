# Arsitektur Proyek & Integrasi Library - BA'PO

Dokumen ini menjelaskan struktur direktori, konfigurasi PWA, pengaturan multi-bahasa (i18n), perutean (routing), manajemen state, integrasi peta Leaflet, Cloudinary SDK, dan visualisasi ApexCharts untuk aplikasi BA'PO.

---

## 📂 Struktur Direktori Proyek

Aplikasi Vue 3 ini dirancang secara modular dan bersih:

```text
bapo/
├── public/
│   ├── favicon.ico
│   ├── icon-192.png
│   ├── icon-512.png
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── main.css             # Konfigurasi Tailwind & Global style
│   ├── components/
│   │   ├── UI/                  # Komponen UI Reusable (Toast, Alert, Dropdown, dll)
│   │   │   ├── Alert.vue
│   │   │   ├── Button.vue
│   │   │   ├── Dropdown.vue
│   │   │   ├── Modal.vue
│   │   │   └── Toast.vue
│   │   ├── Admin/               # Komponen khusus halaman Admin
│   │   │   ├── ChartVolume.vue
│   │   │   └── DepositVerifier.vue
│   │   └── User/                # Komponen khusus halaman User
│   │       ├── ImpactSummary.vue
│   │       ├── LocationMap.vue
│   │       └── DepositForm.vue
│   ├── composables/             # Logic sharing (useAuth, useToast, dll)
│   │   ├── useAuth.ts
│   │   └── useToast.ts
│   ├── locales/                 # File lokalisasi multi-bahasa
│   │   ├── id.json
│   │   ├── en.json
│   │   ├── zh.json
│   │   ├── ja.json
│   │   └── ko.json
│   ├── router/
│   │   └── index.ts             # Vue Router dengan Route Guards
│   ├── services/
│   │   ├── supabase.ts          # Supabase Client Initialization
│   │   └── cloudinary.ts        # Helper Upload Cloudinary
│   ├── App.vue                  # Main Root Component
│   └── main.ts                  # Application Entry Point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts               # Vite Configuration & PWA plugin
```

---

## 📱 Konfigurasi PWA (`vite.config.ts`)

Menggunakan `@vite-pwa/vue` untuk mendukung fungsionalitas offline, penginstalan di smartphone, dan caching berkas statis secara otomatis.

```typescript
import { defineConfig } from 'vite';
import vue from '@vite-api/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: "BA'PO - Balai Pengumpulan POPOK",
        short_name: "BA'PO",
        description: 'Sistem pengumpulan limbah popok berbasis urine Greenetix Indonesia',
        theme_color: '#15803d',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/api\.mapbox\.com\/.*/i, // Jika map menggunakan tiles eksternal
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'map-tiles' }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

---

## 🌐 Internasionalisasi (i18n Setup)

Lokalisasi dikonfigurasi menggunakan `vue-i18n` untuk mendukung 5 bahasa.

```typescript
// src/main.ts (Potongan i18n)
import { createI18n } from 'vue-i18n';
import id from './locales/id.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'id',
  fallbackLocale: 'en',
  messages: { id, en, zh, ja, ko }
});

app.use(i18n);
```

### Contoh File Kamus (`src/locales/id.json`)
```json
{
  "auth": {
    "loginTitle": "Masuk ke BA'PO",
    "registerTitle": "Daftar Akun Baru",
    "username": "Username",
    "password": "Kata Sandi",
    "forgotPassword": "Lupa kata sandi? Hubungi Admin via WhatsApp",
    "loginButton": "Masuk",
    "registerButton": "Daftar",
    "haveAccount": "Sudah punya akun? Masuk",
    "noAccount": "Belum punya akun? Daftar"
  },
  "dashboard": {
    "impactTitle": "Dampak Lingkungan",
    "diapersCollected": "Total Popok Terkumpul",
    "pointsBalance": "Saldo Poin",
    "rupiahBalance": "Konversi Rupiah",
    "history": "Riwayat Setoran",
    "statusPending": "Menunggu Verifikasi",
    "statusApproved": "Disetujui",
    "statusRejected": "Ditolak"
  },
  "info": {
    "schedule": "Hari Pengumpulan: Hanya Hari Minggu, Pukul 16.00 - 18.00 WITA",
    "location": "Lokasi Drop Point: Workshop Greenetix KM 12"
  }
}
```

---

## 🗺️ Integrasi Peta Lokasi (Leaflet Map)

Peta menunjukkan lokasi **Workshop Greenetix Indonesia** di Karangjoang, Balikpapan (Koordinat perkiraan: Latitude `-1.1895`, Longitude `116.8640`).

```vue
<!-- src/components/User/LocationMap.vue -->
<template>
  <div class="w-full h-80 rounded-2xl overflow-hidden shadow-sm">
    <div id="map" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

onMounted(() => {
  const map = L.map('map').setView([-1.1895, 116.8640], 15);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const greenIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  L.marker([-1.1895, 116.8640], { icon: greenIcon })
    .addTo(map)
    .bindPopup('<b>Workshop Greenetix Indonesia</b><br>Jl. PDAM KM 12 Dalam, Karangjoang, Balikpapan.')
    .openPopup();
});
</script>
```

---

## ☁️ Integrasi Cloudinary (Direct Browser Upload)

Untuk mengunggah foto tanpa server perantara (backend-less), gunakan **Cloudinary Unsigned Upload Presets**. Ini mengamankan API key rahasia Anda agar tidak bocor ke client side:

1. Buat akun Cloudinary, buka pengaturan dan aktifkan **Unsigned Upload** di bagian Upload Presets.
2. Buat preset baru (misalnya diberi nama `bapo_preset`).
3. Gunakan kode berikut untuk mengunggah berkas gambar langsung dari input form Vue:

```typescript
// src/services/cloudinary.ts
export async function uploadImage(file: File): Promise<string> {
  const cloudName = 'YOUR_CLOUDINARY_CLOUD_NAME'; // Ganti dengan cloud name Anda
  const uploadPreset = 'bapo_preset'; // Ganti dengan preset unsigned Anda

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Gagal mengunggah foto ke Cloudinary');
  }

  const data = await response.json();
  return data.secure_url; // Mengembalikan URL HTTPS aman gambar
}
```

---

## 📈 Visualisasi Grafik (ApexCharts)

Digunakan pada Dashboard Admin untuk memantau volume popok mingguan dan pengeluaran kas.

```vue
<!-- src/components/Admin/ChartVolume.vue -->
<template>
  <div class="w-full bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl">
    <apexchart type="line" height="300" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const series = ref([
  {
    name: 'Popok Terkumpul',
    type: 'column',
    data: [440, 505, 414, 671, 227, 413, 201]
  },
  {
    name: 'Kas Dikeluarkan (Rupiah)',
    type: 'line',
    data: [22000, 25250, 20700, 33550, 11350, 20650, 10050]
  }
]);

const chartOptions = ref({
  chart: {
    height: 300,
    type: 'line',
    toolbar: { show: false }
  },
  stroke: {
    width: [0, 4],
    curve: 'smooth'
  },
  colors: ['#15803d', '#f59e0b'], // Hijau & Amber
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1]
  },
  labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5', 'Minggu 6', 'Minggu 7'],
  yaxis: [
    {
      title: { text: 'Lembar Popok' }
    },
    {
      opposite: true,
      title: { text: 'Rupiah (Rp)' }
    }
  ]
});
</script>
```
