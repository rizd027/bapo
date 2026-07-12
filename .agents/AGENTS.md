# Aturan Kustomisasi Proyek (Workspace Customization Rules)

## Aturan Desain Halaman Dashboard
Untuk menjaga konsistensi visual di seluruh aplikasi BA'PO, ikuti panduan berikut saat merancang atau menambahkan halaman/tab baru:

1. **Tata Letak Bebas Batasan Lebar Maksimal (`max-w-* mx-auto` di level halaman/tab)**:
   - Seluruh tab atau halaman aktif yang dirender di dalam dashboard (`UserDashboard.vue` atau `AdminDashboard.vue`) harus mewarisi lebar container induk (`App.vue`) secara langsung.
   - Jangan menambahkan kelas penentu lebar seperti `max-w-4xl`, `max-w-5xl`, atau `mx-auto` pada div root dari tab/halaman aktif, agar halaman melebar secara penuh dan konsisten (tidak menghasilkan ruang kosong sisa di sebelah kiri dan kanan pada layar lebar desktop).
   
2. **Keterpaduan Ruang (Fit to Screen / Rapat)**:
   - Rancang halaman penting (seperti Setor popok `/deposit`) agar pas dalam satu halaman layar desktop windows tanpa perlu digulir (scroll), dengan memanfaatkan layout kolom sejajar (`grid grid-cols-1 lg:grid-cols-12 gap-8`) dan mengurangi tinggi elemen visual sekunder seperti peta (`h-44`) jika berada di baris yang sama dengan formulir.

3. **Pemisahan Riwayat Aktivitas**:
   - Aktivitas dengan data riwayat daftar panjang yang tumbuh secara dinamis (seperti riwayat setoran) harus dibuatkan halaman/tab tersendiri (misal: `/history`) agar antarmuka utama tetap rapi, ringkas, dan bebas dari scroll panjang.

## Aturan Keamanan Kode & Reaktivitas (Vue 3)
Untuk mencegah crash halaman blank putih saat interaksi dinamis:

1. **Proteksi Navigasi Opsional (`?.`) pada State Modal/Dialog/Toast**:
   - Saat merancang komponen modal atau dialog dinamis yang datanya bisa di-set ke `null` atau `undefined` untuk memicu transisi keluar (`leave-active-class`), pastikan semua akses properti di dalam template menggunakan operator optional chaining (`?.`) (contoh: `activeDialog?.title` dan bukan `activeDialog.title`).
   - Ini mencegah Vue melemparkan `TypeError: Cannot read properties of null` saat me-render frame terakhir transisi sebelum unmount, yang merupakan penyebab utama **halaman blank putih**.

