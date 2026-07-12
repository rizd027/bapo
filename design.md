# Panduan Desain & UI/UX BA'PO (Balai Pengumpulan POPOK)

Dokumen ini menjelaskan sistem desain, palet warna, tipografi, dan pedoman antarmuka untuk aplikasi BA'PO berdasarkan prinsip **Borderless** & **Cardless** serta identitas lingkungan hidup Greenetix Indonesia.

---

## 🎨 Sistem Warna (Theming)

Aplikasi ini menggunakan sistem warna yang selaras dengan tema kelestarian lingkungan (Eco-friendly Green) dan mendukung transisi mulus antara **Light Mode** dan **Dark Mode**.

### 1. Light Mode (Default)
* **Background Utama:** `#F8FAFC` (Slate-50) - Bersih, modern, dan tidak melelahkan mata.
* **Background Sekunder (Panel/Subtle BG):** `#F1F5F9` (Slate-100) - Digunakan untuk memisahkan bagian konten tanpa border.
* **Teks Utama:** `#0F172A` (Slate-900)
* **Teks Sekunder:** `#475569` (Slate-600)
* **Warna Aksen Dominan (Brand Green):** `#15803D` (Emerald-700)
* **Warna Aksen Hover:** `#166534` (Emerald-800)

### 2. Dark Mode
* **Background Utama:** `#0F172A` (Slate-900) - Gelap pekat dan premium.
* **Background Sekunder (Panel/Subtle BG):** `#1E293B` (Slate-800) - Pemisah visual konten.
* **Teks Utama:** `#F8FAFC` (Slate-50)
* **Teks Sekunder:** `#94A3B8` (Slate-400)
* **Warna Aksen Dominan (Brand Green):** `#22C55E` (Emerald-500)
* **Warna Aksen Hover:** `#4ADE80` (Emerald-400)

---

## 📐 Gaya Visual: Borderless & Cardless

Guna menciptakan antarmuka modern, bersih, dan premium, kami melarang penggunaan kotak ber-border tebal (boxy cards) yang kaku. Sebagai gantinya, ikuti aturan pemisahan visual berikut:

1. **Subtle Background Contrasts:** Gunakan perbedaan warna latar belakang yang tipis untuk membedakan area konten.
   * *Contoh (Light):* Area utama `bg-slate-50`, area widget `bg-slate-100`.
   * *Contoh (Dark):* Area utama `bg-slate-900`, area widget `bg-slate-800`.
2. **Padding & Gaps Proporsional:** Berikan ruang bernapas yang cukup pada setiap elemen (`p-6`, `gap-6`, `space-y-6`).
3. **Rounded Corners:** Gunakan radius sudut yang lembut (`rounded-2xl` atau `rounded-3xl`) pada area berlatar belakang kontras.
4. **Dividers Tipis:** Hanya gunakan garis pembatas jika benar-benar diperlukan untuk memperjelas hierarki. Gunakan `border-slate-100` (Light) atau `border-slate-800` (Dark).

---

## 🚫 Larangan Penggunaan Emoji

* **ATURAN MUTLAK:** Jangan menggunakan emoji (seperti 🍃, ♻️, 💰, 📍) dalam teks UI, tombol, judul, atau label mana pun.
* **SOLUSI:** Gunakan ikon SVG modern dari library **Lucide Vue Next** atau **Heroicons** untuk menjaga estetika profesional dan premium.

---

## 🔤 Tipografi & Hierarki

Gunakan font modern seperti **Inter**, **Outfit**, atau **Roboto** (diimpor dari Google Fonts).

* **Header Utama / Judul Halaman:** Bold/ExtraBold, ukuran `text-2xl` hingga `text-4xl`, tracking tight (`tracking-tight`).
* **Sub-Header:** SemiBold, ukuran `text-lg` hingga `text-xl`.
* **Body Text:** Regular, ukuran `text-base` atau `text-sm` untuk kepadatan informasi yang baik.
* **Small / Metadata:** Medium, ukuran `text-xs` dengan warna teks sekunder.

---

## ✨ Interaksi & Mikro-Animasi

1. **Hover State:** Transisi warna aksen harus halus (`transition-all duration-300 ease-in-out`). Tombol dan tautan harus memiliki umpan balik visual yang jelas (misal: skala mikro `hover:scale-[1.02]` atau perubahan opasitas).
2. **Fokus Input:** Input form tidak boleh menggunakan border tebal saat tidak aktif. Ketika fokus, berikan ring aksen tipis (`focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500`).
3. **Transisi Halaman:** Gunakan transisi fade yang halus saat berpindah rute di Vue (`<transition name="fade" mode="out-in">`).
