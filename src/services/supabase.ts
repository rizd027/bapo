// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { initialMockProfiles, initialMockAccounts } from './mockAccounts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Deteksi apakah kredensial API Supabase telah dikonfigurasi
export const isMockMode = !supabaseUrl || !supabaseAnonKey;

console.log(`[BA'PO App] Running in ${isMockMode ? 'MOCK LOCAL STORAGE MODE' : 'SUPABASE PRODUCTION MODE'}`);

// Model Data
export interface Profile {
  id: string;
  username: string;
  role: 'user' | 'admin';
  total_diapers: number;
  total_points: number;
  total_rupiah: number;
  created_at: string;
}

export interface Deposit {
  id: string;
  user_id: string;
  username?: string; // Cache username untuk admin panel
  diaper_count: number;
  points_earned: number;
  rupiah_earned: number;
  status: 'pending' | 'approved' | 'rejected';
  photo_url: string;
  notes: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}

export interface SystemSettings {
  diaper_rate: number;
  operational_schedule: string;
}

export interface RedeemItem {
  id: string;
  name: string;
  cost: number;
  image: string;
  description: string;
}

export interface Redemption {
  id: string;
  user_id: string;
  username?: string;
  item_id: string;
  item_name: string;
  cost: number;
  status: 'pending' | 'completed' | 'rejected';
  verified_by?: string | null;
  verified_at?: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  sender_id: string;
  sender_username: string;
  message: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error' | 'deposit' | 'redemption' | 'chat';
  is_read: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  image_url: string;  // base64 dataUrl or remote URL
  created_at: string;
  sort_order: number;
}

const realSupabase = !isMockMode ? createClient(supabaseUrl, supabaseAnonKey) : null;

// ==========================================
// MOCK DATABASE SEEDING
// ==========================================
if (isMockMode) {
  // Settings initialization
  if (!localStorage.getItem('bapo_settings')) {
    const defaultSettings: SystemSettings = {
      diaper_rate: 50,
      operational_schedule: 'Hari Pengumpulan: Hanya Hari Minggu, Pukul 16.00 - 18.00 WITA'
    };
    localStorage.setItem('bapo_settings', JSON.stringify(defaultSettings));
  }

  // Redeem items seeding
  if (!localStorage.getItem('bapo_redeem_items')) {
    const defaultRedeemItems: RedeemItem[] = [
      {
        id: 'item-1',
        name: 'Pupuk Cair Bio-Greenetix (250ml)',
        cost: 30,
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400',
        description: 'Pupuk organik cair ramah lingkungan hasil olahan fermentasi popok urine.'
      },
      {
        id: 'item-2',
        name: 'Eco-Bag Belanja Greenetix',
        cost: 50,
        image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=400',
        description: 'Tas belanja kain reusable premium untuk mengurangi sampah plastik kresek.'
      },
      {
        id: 'item-3',
        name: 'Kompos Premium Popok Daur Ulang (1kg)',
        cost: 40,
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400',
        description: 'Kompos padat kaya unsur hara untuk menyuburkan kebun pekarangan rumah.'
      }
    ];
    localStorage.setItem('bapo_redeem_items', JSON.stringify(defaultRedeemItems));
  }

  // Redemptions list initialization
  if (!localStorage.getItem('bapo_redemptions')) {
    localStorage.setItem('bapo_redemptions', JSON.stringify([]));
  }

  // Profiles initialization
  if (!localStorage.getItem('bapo_profiles')) {
    localStorage.setItem('bapo_profiles', JSON.stringify(initialMockProfiles));
  }

  // Deposits initialization
  if (!localStorage.getItem('bapo_deposits')) {
    const mockDeposits: Deposit[] = [
      {
        id: 'dep-1',
        user_id: 'user-uuid-1',
        username: 'user_bapo',
        diaper_count: 50,
        points_earned: 50,
        rupiah_earned: 2500,
        status: 'approved',
        photo_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
        notes: 'Setoran pertama kali popok bayi ukuran M',
        verified_by: 'admin-uuid-1',
        verified_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
      },
      {
        id: 'dep-2',
        user_id: 'user-uuid-1',
        username: 'user_bapo',
        diaper_count: 70,
        points_earned: 70,
        rupiah_earned: 3500,
        status: 'approved',
        photo_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
        notes: 'Setoran rutin popok urine',
        verified_by: 'admin-uuid-1',
        verified_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
      },
      {
        id: 'dep-3',
        user_id: 'user-uuid-1',
        username: 'user_bapo',
        diaper_count: 35,
        points_earned: 0,
        rupiah_earned: 0,
        status: 'pending',
        photo_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
        notes: 'Popok bersih belum ditimbang admin',
        verified_by: null,
        verified_at: null,
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem('bapo_deposits', JSON.stringify(mockDeposits));
  }

  // Accounts credentials simulation
  if (!localStorage.getItem('bapo_accounts')) {
    localStorage.setItem('bapo_accounts', JSON.stringify(initialMockAccounts));
  }

  // Chat messages initialization
  if (!localStorage.getItem('bapo_chat_messages')) {
    const mockMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        user_id: 'user-uuid-1',
        sender_id: 'user-uuid-1',
        sender_username: 'user_bapo',
        message: 'Halo Admin, saya mau bertanya apakah hari Minggu ini balai buka?',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
      },
      {
        id: 'msg-2',
        user_id: 'user-uuid-1',
        sender_id: 'admin-uuid-1',
        sender_username: 'admin_bapo',
        message: 'Halo! Iya betul, balai buka seperti biasa mulai pukul 16.00 WITA.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString()
      }
    ];
    localStorage.setItem('bapo_chat_messages', JSON.stringify(mockMessages));
  }

  // Announcements initialization
  if (!localStorage.getItem('bapo_announcements')) {
    const defaultAnnouncements: Announcement[] = [
      {
        id: 'ann-1',
        title: 'Jadwal Pengumpulan Popok Bulan Ini',
        body: 'Pengumpulan popok daur ulang dibuka setiap Minggu pukul 16.00\u201318.00 WITA. Pastikan popok sudah dibersihkan dan dikumpulkan dalam kantong plastik bersih.',
        image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        sort_order: 0
      },
      {
        id: 'ann-2',
        title: 'Program Poin Dilipatgandakan!',
        body: 'Selama bulan Juli 2026, setiap 1 lembar popok mendapatkan 2 poin! Jangan lewatkan kesempatan ini untuk mengumpulkan poin lebih banyak dan tukarkan dengan hadiah menarik.',
        image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        sort_order: 1
      }
    ];
    localStorage.setItem('bapo_announcements', JSON.stringify(defaultAnnouncements));
  }

  // Dynamic runtime migration for Rohman account
  const currentProfiles = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
  if (currentProfiles.length > 0 && !currentProfiles.some((p: any) => p.username === 'rohman')) {
    currentProfiles.push({
      id: 'admin-uuid-rohman',
      username: 'rohman',
      role: 'admin',
      total_diapers: 0,
      total_points: 0,
      total_rupiah: 0,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('bapo_profiles', JSON.stringify(currentProfiles));
  }

  const currentAccounts = JSON.parse(localStorage.getItem('bapo_accounts') || '{}');
  if (Object.keys(currentAccounts).length > 0 && !currentAccounts['rohman']) {
    currentAccounts['rohman'] = { id: 'admin-uuid-rohman', password: '12345678', role: 'admin' };
    localStorage.setItem('bapo_accounts', JSON.stringify(currentAccounts));
  }
}

// ==========================================
// CORE API WRAPPER SERVICE
// ==========================================

export const dbService = {
  // --- ANNOUNCEMENTS ---
  getAnnouncements(): Announcement[] {
    const raw = localStorage.getItem('bapo_announcements');
    if (!raw) return [];
    return (JSON.parse(raw) as Announcement[]).sort((a, b) => a.sort_order - b.sort_order);
  },

  async upsertAnnouncement(ann: Partial<Announcement> & { title: string; body: string; image_url: string }): Promise<{ data: Announcement | null; error: Error | null }> {
    const all: Announcement[] = JSON.parse(localStorage.getItem('bapo_announcements') || '[]');
    const now = new Date().toISOString();
    if (ann.id) {
      // Update existing
      const idx = all.findIndex(a => a.id === ann.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...ann };
        localStorage.setItem('bapo_announcements', JSON.stringify(all));
        return { data: all[idx], error: null };
      }
    }
    // Insert new
    const newAnn: Announcement = {
      id: 'ann-' + Date.now(),
      title: ann.title,
      body: ann.body,
      image_url: ann.image_url,
      created_at: now,
      sort_order: all.length
    };
    all.push(newAnn);
    localStorage.setItem('bapo_announcements', JSON.stringify(all));
    return { data: newAnn, error: null };
  },

  async deleteAnnouncement(id: string): Promise<{ error: Error | null }> {
    const all: Announcement[] = JSON.parse(localStorage.getItem('bapo_announcements') || '[]');
    const filtered = all.filter(a => a.id !== id).map((a, i) => ({ ...a, sort_order: i }));
    localStorage.setItem('bapo_announcements', JSON.stringify(filtered));
    return { error: null };
  },

  // --- SETTINGS MANAGEMENT ---
  getSettings(): SystemSettings {
    const settings = localStorage.getItem('bapo_settings');
    if (!settings) {
      const defaultSettings = { diaper_rate: 50, operational_schedule: 'Hari Pengumpulan: Hanya Hari Minggu, Pukul 16.00 - 18.00 WITA' };
      localStorage.setItem('bapo_settings', JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return JSON.parse(settings);
  },

  async updateSettings(rate: number, schedule: string): Promise<{ data: SystemSettings | null; error: Error | null }> {
    const newSettings: SystemSettings = { diaper_rate: rate, operational_schedule: schedule };
    localStorage.setItem('bapo_settings', JSON.stringify(newSettings));
    return { data: newSettings, error: null };
  },

  // --- AUTENTIKASI ---
  async signUp(usernameInput: string, passwordInput: string): Promise<{ user: { id: string; username: string } | null; error: Error | null }> {
    const username = usernameInput.trim();
    if (isMockMode) {
      const accounts = JSON.parse(localStorage.getItem('bapo_accounts') || '{}');
      if (accounts[username]) {
        return { user: null, error: new Error('Username sudah digunakan.') };
      }

      const userId = 'user-uuid-' + Math.random().toString(36).substr(2, 9);
      
      // Update akun auth mock
      accounts[username] = { id: userId, password: passwordInput, role: 'user' };
      localStorage.setItem('bapo_accounts', JSON.stringify(accounts));

      // Update profil
      const profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
      const newProfile: Profile = {
        id: userId,
        username,
        role: 'user',
        total_diapers: 0,
        total_points: 0,
        total_rupiah: 0,
        created_at: new Date().toISOString()
      };
      profiles.push(newProfile);
      localStorage.setItem('bapo_profiles', JSON.stringify(profiles));

      const sessionUser = { id: userId, username };
      localStorage.setItem('bapo_current_session', JSON.stringify(sessionUser));

      return { user: sessionUser, error: null };
    } else {
      // Supabase Mode
      const email = `${username}@bapo.local`;
      const { data, error } = await realSupabase!.auth.signUp({
        email,
        password: passwordInput
      });

      if (error) return { user: null, error };
      if (!data.user) return { user: null, error: new Error('Gagal melakukan pendaftaran.') };

      const sessionUser = { id: data.user.id, username };
      localStorage.setItem('bapo_current_session', JSON.stringify(sessionUser));

      return { user: sessionUser, error: null };
    }
  },

  async signIn(usernameInput: string, passwordInput: string): Promise<{ user: { id: string; username: string } | null; error: Error | null }> {
    const username = usernameInput.trim();
    if (isMockMode) {
      const accounts = JSON.parse(localStorage.getItem('bapo_accounts') || '{}');
      const account = accounts[username];
      
      if (!account || account.password !== passwordInput) {
        return { user: null, error: new Error('Username atau kata sandi salah.') };
      }

      const sessionUser = { id: account.id, username };
      localStorage.setItem('bapo_current_session', JSON.stringify(sessionUser));

      return { user: sessionUser, error: null };
    } else {
      // Supabase Mode
      const email = `${username}@bapo.local`;
      const { data, error } = await realSupabase!.auth.signInWithPassword({
        email,
        password: passwordInput
      });

      if (error) return { user: null, error };
      if (!data.user) return { user: null, error: new Error('Gagal masuk.') };

      const sessionUser = { id: data.user.id, username };
      localStorage.setItem('bapo_current_session', JSON.stringify(sessionUser));

      return { user: sessionUser, error: null };
    }
  },

  async signOut(): Promise<{ error: Error | null }> {
    localStorage.removeItem('bapo_current_session');
    if (isMockMode) {
      return { error: null };
    } else {
      const { error } = await realSupabase!.auth.signOut();
      return { error };
    }
  },

  getCurrentUser(): { id: string; username: string } | null {
    const session = localStorage.getItem('bapo_current_session');
    return session ? JSON.parse(session) : null;
  },

  // --- ADMIN CREATION & USER MANAGEMENT ---
  async createAccountByAdmin(usernameInput: string, passwordInput: string): Promise<{ user: Profile | null; error: Error | null }> {
    const username = usernameInput.trim();
    if (isMockMode) {
      const accounts = JSON.parse(localStorage.getItem('bapo_accounts') || '{}');
      if (accounts[username]) {
        return { user: null, error: new Error('Username sudah terdaftar.') };
      }

      const userId = 'user-uuid-' + Math.random().toString(36).substr(2, 9);
      
      // Simpan credentials
      accounts[username] = { id: userId, password: passwordInput, role: 'user' };
      localStorage.setItem('bapo_accounts', JSON.stringify(accounts));

      // Simpan profile
      const profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
      const newProfile: Profile = {
        id: userId,
        username,
        role: 'user',
        total_diapers: 0,
        total_points: 0,
        total_rupiah: 0,
        created_at: new Date().toISOString()
      };
      profiles.push(newProfile);
      localStorage.setItem('bapo_profiles', JSON.stringify(profiles));

      return { user: newProfile, error: null };
    } else {
      const profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
      if (profiles.some(p => p.username === username)) {
        return { user: null, error: new Error('Username sudah terdaftar.') };
      }
      const userId = 'user-uuid-' + Math.random().toString(36).substr(2, 9);
      const newProfile: Profile = {
        id: userId,
        username,
        role: 'user',
        total_diapers: 0,
        total_points: 0,
        total_rupiah: 0,
        created_at: new Date().toISOString()
      };
      profiles.push(newProfile);
      localStorage.setItem('bapo_profiles', JSON.stringify(profiles));
      return { user: newProfile, error: null };
    }
  },

  async deleteUser(userId: string): Promise<{ error: Error | null }> {
    if (isMockMode) {
      let profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
      const target = profiles.find(p => p.id === userId);
      if (!target) return { error: new Error('User tidak ditemukan.') };
      
      profiles = profiles.filter(p => p.id !== userId);
      localStorage.setItem('bapo_profiles', JSON.stringify(profiles));

      const accounts = JSON.parse(localStorage.getItem('bapo_accounts') || '{}');
      if (accounts[target.username]) {
        delete accounts[target.username];
        localStorage.setItem('bapo_accounts', JSON.stringify(accounts));
      }

      let deposits: Deposit[] = JSON.parse(localStorage.getItem('bapo_deposits') || '[]');
      deposits = deposits.filter(d => d.user_id !== userId);
      localStorage.setItem('bapo_deposits', JSON.stringify(deposits));

      return { error: null };
    } else {
      let profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
      profiles = profiles.filter(p => p.id !== userId);
      localStorage.setItem('bapo_profiles', JSON.stringify(profiles));
      return { error: null };
    }
  },

  async resetUserPassword(userId: string, newPasswordInput: string): Promise<{ error: Error | null }> {
    if (isMockMode) {
      const profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
      const user = profiles.find(p => p.id === userId);
      if (!user) return { error: new Error('User tidak ditemukan.') };

      const accounts = JSON.parse(localStorage.getItem('bapo_accounts') || '{}');
      if (accounts[user.username]) {
        accounts[user.username].password = newPasswordInput;
        localStorage.setItem('bapo_accounts', JSON.stringify(accounts));
        return { error: null };
      }
      return { error: new Error('Akun kredensial tidak ditemukan.') };
    } else {
      return { error: null };
    }
  },

  async changeCurrentUserPassword(newPasswordInput: string): Promise<{ error: Error | null }> {
    const session = this.getCurrentUser();
    if (!session) return { error: new Error('User belum masuk.') };

    if (isMockMode) {
      const accounts = JSON.parse(localStorage.getItem('bapo_accounts') || '{}');
      if (accounts[session.username]) {
        accounts[session.username].password = newPasswordInput;
        localStorage.setItem('bapo_accounts', JSON.stringify(accounts));
        return { error: null };
      }
      return { error: new Error('Akun kredensial tidak ditemukan.') };
    } else {
      const { error } = await realSupabase!.auth.updateUser({
        password: newPasswordInput
      });
      return { error };
    }
  },

  // --- PROFILE DATA ---
  async getProfile(userId: string): Promise<{ data: Profile | null; error: Error | null }> {
    if (isMockMode) {
      const profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
      const profile = profiles.find((p) => p.id === userId);
      return { data: profile || null, error: profile ? null : new Error('Profil tidak ditemukan.') };
    } else {
      const { data, error } = await realSupabase!
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error || !data) {
        const profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
        const profile = profiles.find((p) => p.id === userId);
        return { data: profile || null, error: profile ? null : new Error('Profil tidak ditemukan.') };
      }
      return { data: data as Profile | null, error };
    }
  },

  async getAllProfiles(): Promise<{ data: Profile[] | null; error: Error | null }> {
    if (isMockMode) {
      const profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
      const usersOnly = profiles.filter((p) => p.role === 'user');
      return { data: usersOnly, error: null };
    } else {
      const { data, error } = await realSupabase!
        .from('profiles')
        .select('*')
        .eq('role', 'user')
        .order('total_diapers', { ascending: false });
      
      if (error || !data) {
        const profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
        const usersOnly = profiles.filter((p) => p.role === 'user');
        return { data: usersOnly, error: null };
      }
      return { data: data as Profile[] | null, error };
    }
  },

  // --- DEPOSITS DATA ---
  async getDeposits(userId?: string): Promise<{ data: Deposit[] | null; error: Error | null }> {
    if (isMockMode) {
      const deposits: Deposit[] = JSON.parse(localStorage.getItem('bapo_deposits') || '[]');
      if (userId) {
        const userDeps = deposits.filter((d) => d.user_id === userId);
        return { data: userDeps.sort((a, b) => b.created_at.localeCompare(a.created_at)), error: null };
      }
      return { data: deposits.sort((a, b) => b.created_at.localeCompare(a.created_at)), error: null };
    } else {
      let query = realSupabase!.from('deposits').select(`
        *,
        profiles:user_id (username)
      `);
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error || !data) {
        const deposits: Deposit[] = JSON.parse(localStorage.getItem('bapo_deposits') || '[]');
        if (userId) {
          const userDeps = deposits.filter((d) => d.user_id === userId);
          return { data: userDeps.sort((a, b) => b.created_at.localeCompare(a.created_at)), error: null };
        }
        return { data: deposits.sort((a, b) => b.created_at.localeCompare(a.created_at)), error: null };
      }

      const formatted: Deposit[] = data.map((d: any) => ({
        id: d.id,
        user_id: d.user_id,
        username: d.profiles?.username || 'Pengguna',
        diaper_count: d.diaper_count,
        points_earned: d.points_earned,
        rupiah_earned: d.rupiah_earned,
        status: d.status,
        photo_url: d.photo_url,
        notes: d.notes,
        verified_by: d.verified_by,
        verified_at: d.verified_at,
        created_at: d.created_at
      }));

      return { data: formatted, error: null };
    }
  },

  async createDeposit(diaperCount: number, photoUrl: string, notes: string | null): Promise<{ data: Deposit | null; error: Error | null }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { data: null, error: new Error('User belum login.') };

    if (isMockMode) {
      const deposits: Deposit[] = JSON.parse(localStorage.getItem('bapo_deposits') || '[]');
      
      const newDeposit: Deposit = {
        id: 'dep-' + Math.random().toString(36).substr(2, 9),
        user_id: currentUser.id,
        username: currentUser.username,
        diaper_count: diaperCount,
        points_earned: 0,
        rupiah_earned: 0,
        status: 'pending',
        photo_url: photoUrl,
        notes: notes || null,
        verified_by: null,
        verified_at: null,
        created_at: new Date().toISOString()
      };
      
      deposits.push(newDeposit);
      localStorage.setItem('bapo_deposits', JSON.stringify(deposits));
      this.createNotification('admin', 'Setoran Popok Baru', `@${currentUser.username} mengirim setoran popok baru sebanyak ${diaperCount} lembar.`, 'deposit');
      return { data: newDeposit, error: null };
    } else {
      const { data, error } = await realSupabase!
        .from('deposits')
        .insert({
          user_id: currentUser.id,
          diaper_count: diaperCount,
          photo_url: photoUrl,
          notes: notes || null,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) {
        const deposits: Deposit[] = JSON.parse(localStorage.getItem('bapo_deposits') || '[]');
        const newDeposit: Deposit = {
          id: 'dep-' + Math.random().toString(36).substr(2, 9),
          user_id: currentUser.id,
          username: currentUser.username,
          diaper_count: diaperCount,
          points_earned: 0,
          rupiah_earned: 0,
          status: 'pending',
          photo_url: photoUrl,
          notes: notes || null,
          verified_by: null,
          verified_at: null,
          created_at: new Date().toISOString()
        };
        deposits.push(newDeposit);
        localStorage.setItem('bapo_deposits', JSON.stringify(deposits));
        this.createNotification('admin', 'Setoran Popok Baru', `@${currentUser.username} mengirim setoran popok baru sebanyak ${diaperCount} lembar.`, 'deposit');
        return { data: newDeposit, error: null };
      }
      return { data: data as Deposit, error: null };
    }
  },

  // --- DIRECT OFFLINE ENTRY DEPOSIT BY ADMIN ---
  async createDepositByAdmin(userId: string, diaperCount: number, notes: string | null, adminId: string): Promise<{ data: Deposit | null; error: Error | null }> {
    const settings = this.getSettings();
    const rate = settings.diaper_rate;
    const points = diaperCount;
    const rupiah = diaperCount * rate;

    // Ambil detail username verifikator admin untuk disematkan
    const profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
    const adminObj = profiles.find(p => p.id === adminId);
    const adminUsername = adminObj ? adminObj.username : 'admin_bapo';

    if (isMockMode) {
      const deposits: Deposit[] = JSON.parse(localStorage.getItem('bapo_deposits') || '[]');
      
      const targetUser = profiles.find((p) => p.id === userId);
      if (!targetUser) return { data: null, error: new Error('User tidak ditemukan.') };

      const newDeposit: Deposit = {
        id: 'dep-' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        username: targetUser.username,
        diaper_count: diaperCount,
        points_earned: points,
        rupiah_earned: rupiah,
        status: 'approved',
        photo_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
        notes: notes || `Setoran Offline oleh @${adminUsername}`,
        verified_by: adminUsername, // Save the actual name of admin for audit log
        verified_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      deposits.push(newDeposit);
      localStorage.setItem('bapo_deposits', JSON.stringify(deposits));

      const profileIndex = profiles.findIndex((p) => p.id === userId);
      if (profileIndex !== -1) {
        profiles[profileIndex].total_diapers += diaperCount;
        profiles[profileIndex].total_points += points;
        profiles[profileIndex].total_rupiah += rupiah;
        localStorage.setItem('bapo_profiles', JSON.stringify(profiles));
      }

      this.createNotification(userId, 'Setoran Offline Dicatat', `Petugas @${adminUsername} mencatatkan setoran popok offline sebanyak ${diaperCount} lembar untuk Anda.`, 'deposit');
      return { data: newDeposit, error: null };
    } else {
      return this.createDepositByAdminLocal(userId, diaperCount, notes, adminUsername, rate);
    }
  },

  createDepositByAdminLocal(userId: string, diaperCount: number, notes: string | null, adminUsername: string, rate: number): { data: Deposit | null; error: Error | null } {
    const deposits: Deposit[] = JSON.parse(localStorage.getItem('bapo_deposits') || '[]');
    const profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
    
    const targetUser = profiles.find((p) => p.id === userId);
    if (!targetUser) return { data: null, error: new Error('User tidak ditemukan.') };

    const newDeposit: Deposit = {
      id: 'dep-' + Math.random().toString(36).substr(2, 9),
      user_id: userId,
      username: targetUser.username,
      diaper_count: diaperCount,
      points_earned: diaperCount,
      rupiah_earned: diaperCount * rate,
      status: 'approved',
      photo_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
      notes: notes || `Setoran Offline oleh @${adminUsername}`,
      verified_by: adminUsername,
      verified_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    deposits.push(newDeposit);
    localStorage.setItem('bapo_deposits', JSON.stringify(deposits));

    const pIdx = profiles.findIndex((p) => p.id === userId);
    if (pIdx !== -1) {
      profiles[pIdx].total_diapers += diaperCount;
      profiles[pIdx].total_points += diaperCount;
      profiles[pIdx].total_rupiah += diaperCount * rate;
      localStorage.setItem('bapo_profiles', JSON.stringify(profiles));
    }

    this.createNotification(userId, 'Setoran Offline Dicatat', `Petugas @${adminUsername} mencatatkan setoran popok offline sebanyak ${diaperCount} lembar untuk Anda.`, 'deposit');
    return { data: newDeposit, error: null };
  },

  async verifyDeposit(depositId: string, status: 'approved' | 'rejected', finalCount: number, adminId: string): Promise<{ data: Deposit | null; error: Error | null }> {
    const settings = this.getSettings();
    const activeRate = settings.diaper_rate;

    const profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
    const adminObj = profiles.find(p => p.id === adminId);
    const adminUsername = adminObj ? adminObj.username : 'admin_bapo';

    if (isMockMode) {
      const deposits: Deposit[] = JSON.parse(localStorage.getItem('bapo_deposits') || '[]');
      const depositIndex = deposits.findIndex((d) => d.id === depositId);
      
      if (depositIndex === -1) return { data: null, error: new Error('Setoran tidak ditemukan.') };
      const deposit = deposits[depositIndex];

      if (deposit.status !== 'pending') {
        return { data: null, error: new Error('Setoran ini sudah diproses sebelumnya.') };
      }

      deposit.status = status;
      deposit.verified_by = adminUsername; // Save admin username for audit log
      deposit.verified_at = new Date().toISOString();

      if (status === 'approved') {
        deposit.diaper_count = finalCount;
        deposit.points_earned = finalCount;
        deposit.rupiah_earned = finalCount * activeRate;

        const profileIndex = profiles.findIndex((p) => p.id === deposit.user_id);
        if (profileIndex !== -1) {
          profiles[profileIndex].total_diapers += deposit.diaper_count;
          profiles[profileIndex].total_points += deposit.points_earned;
          profiles[profileIndex].total_rupiah += deposit.rupiah_earned;
          localStorage.setItem('bapo_profiles', JSON.stringify(profiles));
        }
        this.createNotification(deposit.user_id, 'Setoran Popok Disetujui', `Setoran popok Anda sebanyak ${finalCount} lembar telah disetujui oleh @${adminUsername}. Poin Anda bertambah +${finalCount} pts.`, 'success');
      } else {
        this.createNotification(deposit.user_id, 'Setoran Popok Ditolak', `Setoran popok Anda ditolak oleh @${adminUsername}. Silakan hubungi admin via chat untuk klarifikasi.`, 'error');
      }

      deposits[depositIndex] = deposit;
      localStorage.setItem('bapo_deposits', JSON.stringify(deposits));
      return { data: deposit, error: null };
    } else {
      // Fallback local update directly to record name
      const deposits: Deposit[] = JSON.parse(localStorage.getItem('bapo_deposits') || '[]');
      const idx = deposits.findIndex(d => d.id === depositId);
      if (idx !== -1) {
        const deposit = deposits[idx];
        deposit.status = status;
        deposit.verified_by = adminUsername;
        deposit.verified_at = new Date().toISOString();
        if (status === 'approved') {
          deposit.diaper_count = finalCount;
          deposit.points_earned = finalCount;
          deposit.rupiah_earned = finalCount * activeRate;
          const pIdx = profiles.findIndex(p => p.id === deposit.user_id);
          if (pIdx !== -1) {
            profiles[pIdx].total_diapers += finalCount;
            profiles[pIdx].total_points += finalCount;
            profiles[pIdx].total_rupiah += finalCount * activeRate;
            localStorage.setItem('bapo_profiles', JSON.stringify(profiles));
          }
          this.createNotification(deposit.user_id, 'Setoran Popok Disetujui', `Setoran popok Anda sebanyak ${finalCount} lembar telah disetujui oleh @${adminUsername}. Poin Anda bertambah +${finalCount} pts.`, 'success');
        } else {
          this.createNotification(deposit.user_id, 'Setoran Popok Ditolak', `Setoran popok Anda ditolak oleh @${adminUsername}. Silakan hubungi admin via chat untuk klarifikasi.`, 'error');
        }
        deposits[idx] = deposit;
        localStorage.setItem('bapo_deposits', JSON.stringify(deposits));
        return { data: deposit, error: null };
      }
      return { data: null, error: new Error('Setoran tidak ditemukan.') };
    }
  },

  // --- ECO-REDEMPTION SYSTEM (TUKAR POIN) ---
  getRedeemItems(): RedeemItem[] {
    const items = localStorage.getItem('bapo_redeem_items');
    return items ? JSON.parse(items) : [];
  },

  async redeemItem(userId: string, itemId: string, quantityInput: number = 1): Promise<{ data: Redemption | null; error: Error | null }> {
    const quantity = Math.max(1, quantityInput);
    const items = this.getRedeemItems();
    const item = items.find((i) => i.id === itemId);
    if (!item) return { data: null, error: new Error('Barang tidak ditemukan di katalog.') };

    const totalCost = item.cost * quantity;

    const profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
    const profileIndex = profiles.findIndex((p) => p.id === userId);
    if (profileIndex === -1) return { data: null, error: new Error('Profil pengguna tidak ditemukan.') };

    const profile = profiles[profileIndex];
    if (profile.total_points < totalCost) {
      return { data: null, error: new Error(`Poin tidak cukup. Poin Anda: ${profile.total_points}, biaya: ${totalCost} poin.`) };
    }

    // Kurangi poin masyarakat
    profiles[profileIndex].total_points -= totalCost;
    localStorage.setItem('bapo_profiles', JSON.stringify(profiles));

    // Catat Transaksi Penukaran
    const redemptions: Redemption[] = JSON.parse(localStorage.getItem('bapo_redemptions') || '[]');
    const newRedemption: Redemption = {
      id: 'red-' + Math.random().toString(36).substr(2, 9),
      user_id: userId,
      username: profile.username,
      item_id: itemId,
      item_name: `${item.name} (x${quantity})`,
      cost: totalCost,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    redemptions.push(newRedemption);
    localStorage.setItem('bapo_redemptions', JSON.stringify(redemptions));

    this.createNotification('admin', 'Pengajuan Penukaran Poin', `@${profile.username} mengajukan penukaran ${totalCost} poin dengan "${item.name} (x${quantity})".`, 'redemption');
    return { data: newRedemption, error: null };
  },

  async getRedemptions(userId?: string): Promise<{ data: Redemption[] | null; error: Error | null }> {
    const rawRedemptions: any[] = JSON.parse(localStorage.getItem('bapo_redemptions') || '[]');
    const redemptions: Redemption[] = rawRedemptions.map(r => ({
      ...r,
      status: r.status || 'pending'
    }));

    if (userId) {
      const filtered = redemptions.filter((r) => r.user_id === userId);
      return { data: filtered.sort((a, b) => b.created_at.localeCompare(a.created_at)), error: null };
    }
    return { data: redemptions.sort((a, b) => b.created_at.localeCompare(a.created_at)), error: null };
  },

  async completeRedemption(redemptionId: string, adminId: string): Promise<{ data: Redemption | null; error: Error | null }> {
    const profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
    const adminObj = profiles.find(p => p.id === adminId);
    const adminUsername = adminObj ? adminObj.username : 'admin_bapo';

    const redemptions: Redemption[] = JSON.parse(localStorage.getItem('bapo_redemptions') || '[]');
    const index = redemptions.findIndex(r => r.id === redemptionId);
    if (index === -1) return { data: null, error: new Error('Transaksi penukaran tidak ditemukan.') };
    
    redemptions[index].status = 'completed';
    redemptions[index].verified_by = adminUsername;
    redemptions[index].verified_at = new Date().toISOString();

    localStorage.setItem('bapo_redemptions', JSON.stringify(redemptions));
    
    this.createNotification(redemptions[index].user_id, 'Hadiah Diserahkan', `Hadiah "${redemptions[index].item_name}" telah diserahkan oleh petugas @${adminUsername}. Terima kasih!`, 'success');
    return { data: redemptions[index], error: null };
  },

  async rejectRedemption(redemptionId: string, adminId: string): Promise<{ data: Redemption | null; error: Error | null }> {
    const profiles: Profile[] = JSON.parse(localStorage.getItem('bapo_profiles') || '[]');
    const adminObj = profiles.find(p => p.id === adminId);
    const adminUsername = adminObj ? adminObj.username : 'admin_bapo';

    const redemptions: Redemption[] = JSON.parse(localStorage.getItem('bapo_redemptions') || '[]');
    const index = redemptions.findIndex(r => r.id === redemptionId);
    if (index === -1) return { data: null, error: new Error('Transaksi penukaran tidak ditemukan.') };
    
    const redemption = redemptions[index];
    if (redemption.status !== 'pending') {
      return { data: null, error: new Error('Transaksi penukaran ini sudah diproses.') };
    }

    // Refund points to citizen
    const userProfileIndex = profiles.findIndex(p => p.id === redemption.user_id);
    if (userProfileIndex !== -1) {
      profiles[userProfileIndex].total_points += redemption.cost;
      localStorage.setItem('bapo_profiles', JSON.stringify(profiles));
    }

    redemption.status = 'rejected';
    redemption.verified_by = adminUsername;
    redemption.verified_at = new Date().toISOString();
    
    redemptions[index] = redemption;
    localStorage.setItem('bapo_redemptions', JSON.stringify(redemptions));

    // Create citizen notification
    this.createNotification(
      redemption.user_id,
      'Penukaran Hadiah Ditolak',
      `Penukaran "${redemption.item_name}" ditolak oleh petugas @${adminUsername}. Poin Anda sebanyak ${redemption.cost} pts telah dikembalikan.`,
      'error'
    );

    return { data: redemption, error: null };
  },

  // --- CHAT SYSTEM API ---
  getChatMessages(userId?: string): ChatMessage[] {
    const messages: ChatMessage[] = JSON.parse(localStorage.getItem('bapo_chat_messages') || '[]');
    if (userId) {
      return messages.filter(m => m.user_id === userId).sort((a, b) => a.created_at.localeCompare(b.created_at));
    }
    return messages.sort((a, b) => a.created_at.localeCompare(b.created_at));
  },

  async sendChatMessage(userId: string, senderId: string, senderUsername: string, text: string): Promise<{ data: ChatMessage | null; error: Error | null }> {
    const messages: ChatMessage[] = JSON.parse(localStorage.getItem('bapo_chat_messages') || '[]');
    const newMessage: ChatMessage = {
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      user_id: userId,
      sender_id: senderId,
      sender_username: senderUsername,
      message: text.trim(),
      created_at: new Date().toISOString()
    };
    messages.push(newMessage);
    localStorage.setItem('bapo_chat_messages', JSON.stringify(messages));

    const recipientId = senderId === userId ? 'admin' : userId;
    const cleanText = text.trim();
    const shortText = cleanText.length > 50 ? cleanText.substring(0, 47) + '...' : cleanText;
    this.createNotification(
      recipientId,
      'Pesan Baru di Chat',
      `@${senderUsername}: "${shortText}"`,
      'chat'
    );

    return { data: newMessage, error: null };
  },

  // --- NOTIFICATION SYSTEM API ---
  getNotifications(userId: string): Notification[] {
    const raw = localStorage.getItem('bapo_notifications');
    const notifications: Notification[] = raw ? JSON.parse(raw) : [];
    return notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  },

  createNotification(userId: string, title: string, message: string, type: Notification['type']): Notification {
    const raw = localStorage.getItem('bapo_notifications');
    const notifications: Notification[] = raw ? JSON.parse(raw) : [];
    const newNotif: Notification = {
      id: 'notif-' + Math.random().toString(36).substr(2, 9),
      user_id: userId,
      title,
      message,
      type,
      is_read: false,
      created_at: new Date().toISOString()
    };
    notifications.push(newNotif);
    localStorage.setItem('bapo_notifications', JSON.stringify(notifications));
    return newNotif;
  },

  markNotificationAsRead(notificationId: string): void {
    const raw = localStorage.getItem('bapo_notifications');
    if (!raw) return;
    const notifications: Notification[] = JSON.parse(raw);
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      notifications[index].is_read = true;
      localStorage.setItem('bapo_notifications', JSON.stringify(notifications));
    }
  },

  deleteNotification(notificationId: string): void {
    const raw = localStorage.getItem('bapo_notifications');
    if (!raw) return;
    const notifications: Notification[] = JSON.parse(raw);
    const filtered = notifications.filter(n => n.id !== notificationId);
    localStorage.setItem('bapo_notifications', JSON.stringify(filtered));
  },

  clearAllNotifications(userId: string): void {
    const raw = localStorage.getItem('bapo_notifications');
    if (!raw) return;
    const notifications: Notification[] = JSON.parse(raw);
    const filtered = notifications.filter(n => n.user_id !== userId);
    localStorage.setItem('bapo_notifications', JSON.stringify(filtered));
  },

  // --- BACKUP EXPORT & IMPORT ---
  exportBackupData(): string {
    const data = {
      profiles: JSON.parse(localStorage.getItem('bapo_profiles') || '[]'),
      deposits: JSON.parse(localStorage.getItem('bapo_deposits') || '[]'),
      accounts: JSON.parse(localStorage.getItem('bapo_accounts') || '{}'),
      settings: JSON.parse(localStorage.getItem('bapo_settings') || '{}'),
      redemptions: JSON.parse(localStorage.getItem('bapo_redemptions') || '[]'),
      chat_messages: JSON.parse(localStorage.getItem('bapo_chat_messages') || '[]'),
      notifications: JSON.parse(localStorage.getItem('bapo_notifications') || '[]')
    };
    return JSON.stringify(data, null, 2);
  },

  importBackupData(jsonString: string): { success: boolean; error: Error | null } {
    try {
      const data = JSON.parse(jsonString);
      if (!data.profiles || !data.deposits || !data.accounts || !data.settings) {
        return { success: false, error: new Error('Struktur berkas backup tidak lengkap atau salah.') };
      }
      
      localStorage.setItem('bapo_profiles', JSON.stringify(data.profiles));
      localStorage.setItem('bapo_deposits', JSON.stringify(data.deposits));
      localStorage.setItem('bapo_accounts', JSON.stringify(data.accounts));
      localStorage.setItem('bapo_settings', JSON.stringify(data.settings));
      localStorage.setItem('bapo_redemptions', JSON.stringify(data.redemptions || []));
      localStorage.setItem('bapo_chat_messages', JSON.stringify(data.chat_messages || []));
      localStorage.setItem('bapo_notifications', JSON.stringify(data.notifications || []));
      
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: new Error(e.message || 'Gagal mengurai file JSON backup.') };
    }
  }
};
