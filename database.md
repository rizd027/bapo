# Skema & Arsitektur Database Supabase - BA'PO

Dokumen ini mendefinisikan struktur tabel database, kebijakan keamanan (Row Level Security), trigger otomatis, dan skema autentikasi berbasis username tanpa email untuk aplikasi BA'PO di Supabase.

---

## 🔐 Strategi Autentikasi Tanpa Email

Supabase secara default menggunakan email/password untuk autentikasi GoTrue. Untuk mendukung autentikasi murni berbasis **username** tanpa merusak fungsionalitas bawaan Supabase Auth (JWT, Session Management, dan Middleware), kita menggunakan pendekatan **Dummy Email Domain**:

1. **Di Sisi Client (Vue App):**
   * Form hanya meminta `username` dan `password`.
   * Saat registrasi/login, aplikasi secara otomatis menambahkan suffix `@bapo.local` ke username untuk dikirim ke Supabase Auth (misal: `aljabar` menjadi `aljabar@bapo.local`).
2. **Di Sisi Database:**
   * Kita membuat tabel `profiles` yang menyimpan `username` asli (tanpa suffix `@bapo.local`) beserta metadata user seperti saldo poin, saldo rupiah, dan peran (role).
   * Relasi `profiles.id` merujuk langsung ke `auth.users.id` (UUID).

Dengan cara ini, pengembang tidak perlu membuat backend custom untuk auth, dan semua SDK Supabase bawaan tetap berfungsi dengan aman.

---

## 📊 Skema Tabel Database

Silakan jalankan SQL Script berikut di Supabase SQL Editor:

```sql
-- 1. ENUM UNTUK ROLE DAN STATUS SETORAN
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE deposit_status AS ENUM ('pending', 'approved', 'rejected');

-- 2. TABEL PROFIL PENGGUNA (PROFILES)
-- Tabel ini menampung informasi tambahan pengguna dan tersinkronisasi dengan auth.users
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    role user_role DEFAULT 'user' NOT NULL,
    total_diapers INTEGER DEFAULT 0 NOT NULL,
    total_points INTEGER DEFAULT 0 NOT NULL,
    total_rupiah INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    CONSTRAINT username_min_length CHECK (char_length(username) >= 5)
);

-- 3. TABEL SETORAN POPOK (DEPOSITS)
-- Menyimpan data pengumpulan popok oleh user yang memerlukan verifikasi admin
CREATE TABLE public.deposits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    diaper_count INTEGER NOT NULL CHECK (diaper_count > 0),
    points_earned INTEGER DEFAULT 0 NOT NULL, -- dihitung otomatis/diedit admin
    rupiah_earned INTEGER DEFAULT 0 NOT NULL, -- diaper_count * 50
    status deposit_status DEFAULT 'pending' NOT NULL,
    photo_url TEXT NOT NULL, -- URL Cloudinary bukti setoran
    notes TEXT,
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Mengaktifkan Row Level Security (RLS) pada tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
```

---

## 🔒 Kebijakan Keamanan (Row Level Security - RLS)

Kebijakan ini memastikan bahwa data aman dan hanya dapat diakses/dimodifikasi oleh pihak yang berwenang.

### 1. Kebijakan Tabel `profiles`
```sql
-- Pengguna dapat melihat semua profil (untuk validasi keunikan username) atau profil mereka sendiri
CREATE POLICY "Allow public read access to profiles" 
ON public.profiles FOR SELECT 
USING (true);

-- Pengguna hanya dapat memperbarui profil mereka sendiri (misal mengganti username)
CREATE POLICY "Allow users to update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Hanya sistem/trigger atau admin yang bisa memasukkan data profil secara langsung
CREATE POLICY "Allow admin full control on profiles"
ON public.profiles FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
```

### 2. Kebijakan Tabel `deposits`
```sql
-- User dapat melihat setoran mereka sendiri, Admin dapat melihat seluruh setoran
CREATE POLICY "Allow users to view own deposits and admin to view all" 
ON public.deposits FOR SELECT 
USING (
    auth.uid() = user_id OR 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- User dapat mengajukan setoran baru
CREATE POLICY "Allow users to insert own deposits" 
ON public.deposits FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Hanya Admin yang boleh memperbarui status setoran (Verifikasi/Persetujuan)
CREATE POLICY "Allow admin to update deposits" 
ON public.deposits FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Hanya Admin yang boleh menghapus data setoran (jika diperlukan)
CREATE POLICY "Allow admin to delete deposits" 
ON public.deposits FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
```

---

## ⚡ Trigger Otomatis & Sinkronisasi Realtime

### 1. Trigger Registrasi Baru (Sinkronisasi Auth -> Profiles)
Saat user baru terdaftar di Supabase Auth, trigger ini akan membuat record profil yang sesuai secara otomatis.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    clean_username VARCHAR;
BEGIN
    -- Mengambil username dari email dummy (misal: aljabar@bapo.local -> aljabar)
    clean_username := SPLIT_PART(NEW.email, '@', 1);

    INSERT INTO public.profiles (id, username, role)
    VALUES (
        NEW.id,
        clean_username,
        -- Default role admin jika username berawalan admin_ atau greenetix_
        CASE 
            WHEN clean_username LIKE 'admin_%' OR clean_username LIKE 'greenetix_%' THEN 'admin'::user_role
            ELSE 'user'::user_role
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Trigger Perubahan Status Setoran (Update Saldo User)
Saat admin menyetujui setoran popok (`status` berubah menjadi `approved`), trigger ini secara otomatis menghitung poin dan rupiah, lalu menambahkannya ke profil user.

```sql
CREATE OR REPLACE FUNCTION public.update_user_stats_on_deposit_approval()
RETURNS TRIGGER AS $$
BEGIN
    -- Jika status berubah menjadi approved
    IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
        -- Kalkulasi nilai jika belum diset oleh admin
        NEW.rupiah_earned := NEW.diaper_count * 50;
        NEW.points_earned := NEW.diaper_count; -- 1 lembar = 1 poin

        -- Update stats di tabel profiles
        UPDATE public.profiles
        SET 
            total_diapers = total_diapers + NEW.diaper_count,
            total_points = total_points + NEW.points_earned,
            total_rupiah = total_rupiah + NEW.rupiah_earned
        WHERE id = NEW.user_id;
        
    -- Jika setoran yang disetujui dibatalkan/dihapus (opsional untuk audit)
    ELSIF OLD.status = 'approved' AND NEW.status = 'rejected' THEN
        UPDATE public.profiles
        SET 
            total_diapers = total_diapers - OLD.diaper_count,
            total_points = total_points - OLD.points_earned,
            total_rupiah = total_rupiah - OLD.rupiah_earned
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_deposit_status_change
    BEFORE UPDATE ON public.deposits
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.update_user_stats_on_deposit_approval();
```

---

## 🌱 Data Awal (Seeding)

Supabase secara otomatis membuat user admin ketika data dimasukkan melalui API. Namun, untuk inisialisasi awal, Anda dapat membuat user admin pertama dengan langkah berikut:

1. **Melalui Dasbor Supabase (Authentication):**
   * Klik **Add User** -> **Create User**.
   * Masukkan email dummy: `admin_bapo@bapo.local` (atau `greenetix_admin@bapo.local`).
   * Tentukan Password aman.
   * Auto-confirm user diaktifkan agar bisa langsung login.
2. Trigger `on_auth_user_created` akan mendeteksi awalan `admin_` pada username dan otomatis menandai kolom `role` sebagai `'admin'` di tabel `public.profiles`.
