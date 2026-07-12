// src/main.ts
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import VueApexCharts from 'vue3-apexcharts';

import App from './App.vue';
import router from './router';

// Styles
import './assets/main.css';
import 'leaflet/dist/leaflet.css';

// Locales
import id from './locales/id.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';

// Initialize i18n
const i18n = createI18n({
  legacy: false, // Gunakan Composition API mode
  locale: localStorage.getItem('locale') || 'id',
  fallbackLocale: 'en',
  messages: { id, en, zh, ja, ko }
});

const app = createApp(App);

app.use(i18n);
app.use(router);
app.use(VueApexCharts);

app.mount('#app');

// Register Vite PWA Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('[BA\'PO PWA] Service Worker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.error('[BA\'PO PWA] Service Worker registration failed:', err);
      });
  });
}
