// src/services/mockAccounts.ts

export interface MockProfile {
  id: string;
  username: string;
  role: 'admin' | 'user';
  total_diapers: number;
  total_points: number;
  total_rupiah: number;
  created_at: string;
}

export interface MockAccount {
  id: string;
  password:  string;
  role: 'admin' | 'user';
}

/**
 * Default initial mock profiles for seeding
 * Developers can add new admin or user profiles here
 */
export const initialMockProfiles: MockProfile[] = [
  {
    id: 'admin-uuid-1',
    username: 'admin_bapo',
    role: 'admin',
    total_diapers: 0,
    total_points: 0,
    total_rupiah: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 'admin-uuid-2',
    username: 'greenetix_admin',
    role: 'admin',
    total_diapers: 0,
    total_points: 0,
    total_rupiah: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 'admin-uuid-rohman',
    username: 'rohman',
    role: 'admin',
    total_diapers: 0,
    total_points: 0,
    total_rupiah: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 'user-uuid-1',
    username: 'user_bapo',
    role: 'user',
    total_diapers: 120,
    total_points: 120,
    total_rupiah: 6000,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
  }
];

/**
 * Default initial mock accounts credentials mapping for sign in simulation
 * Developers can configure credentials and roles here
 */
export const initialMockAccounts: Record<string, MockAccount> = {
  'admin_bapo': { id: 'admin-uuid-1', password: 'password123', role: 'admin' },
  'greenetix_admin': { id: 'admin-uuid-2', password: 'password123', role: 'admin' },
  'rohman': { id: 'admin-uuid-rohman', password: '12345678', role: 'admin' },
  'user_bapo': { id: 'user-uuid-1', password: 'password123', role: 'user' }
};
