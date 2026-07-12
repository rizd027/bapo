// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { dbService } from '../services/supabase';

const routes = [
  {
    path: '/',
    redirect: () => {
      const user = dbService.getCurrentUser();
      if (!user) return '/login';
      return '/login';
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresGuest: true }
  },

  // --- PORTAL MASYARAKAT (USER) FLAT ROUTES ---
  {
    path: '/home',
    name: 'UserHome',
    component: () => import('../views/UserDashboard.vue'),
    meta: { requiresAuth: true, role: 'user', tab: 'home' }
  },
  {
    path: '/deposit',
    name: 'UserDeposit',
    component: () => import('../views/UserDashboard.vue'),
    meta: { requiresAuth: true, role: 'user', tab: 'deposit' }
  },
  {
    path: '/history',
    name: 'UserHistory',
    component: () => import('../views/UserDashboard.vue'),
    meta: { requiresAuth: true, role: 'user', tab: 'history' }
  },
  {
    path: '/redemption',
    name: 'UserRedemption',
    component: () => import('../views/UserDashboard.vue'),
    meta: { requiresAuth: true, role: 'user', tab: 'redemption' }
  },
  {
    path: '/settings',
    name: 'UserSettings',
    component: () => import('../views/UserDashboard.vue'),
    meta: { requiresAuth: true, role: 'user', tab: 'settings' }
  },


  // --- PORTAL ADMIN FLAT ROUTES ---
  {
    path: '/admin/overview',
    name: 'AdminOverview',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin', tab: 'overview' }
  },
  {
    path: '/admin/queue',
    name: 'AdminQueue',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin', tab: 'queue' }
  },
  {
    path: '/admin/direct',
    name: 'AdminDirect',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin', tab: 'directEntry' }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin', tab: 'userManagement' }
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin', tab: 'settings' }
  },
  {
    path: '/admin/chat',
    name: 'AdminChat',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin', tab: 'chat' }
  },

  // --- COMPATIBILITY BACKWARD REDIRECTS ---
  {
    path: '/dashboard',
    redirect: '/home'
  },
  {
    path: '/admin',
    redirect: '/admin/overview'
  },
  {
    path: '/admin/dashboard',
    redirect: '/admin/overview'
  },

  // Catch all route redirect to home/login
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ROUTE NAVIGATION GUARDS
router.beforeEach(async (to, _from, next) => {
  const currentUser = dbService.getCurrentUser();

  // 1. Cek Route yang membutuhkan Auth
  if (to.meta.requiresAuth) {
    if (!currentUser) {
      return next('/login');
    }

    // Ambil Profil untuk memverifikasi role
    const { data: profile } = await dbService.getProfile(currentUser.id);
    if (!profile) {
      dbService.signOut();
      return next('/login');
    }

    // Cek kecocokan role
    if (to.meta.role && to.meta.role !== profile.role) {
      // Jika salah arahkan ke dashboard masing-masing
      if (profile.role === 'admin') {
        return next('/admin/overview');
      } else {
        return next('/home');
      }
    }
    
    return next();
  }

  // 2. Cek Route khusus Guest (Login/Register)
  if (to.meta.requiresGuest) {
    if (currentUser) {
      const { data: profile } = await dbService.getProfile(currentUser.id);
      if (profile) {
        if (profile.role === 'admin') {
          return next('/admin/overview');
        } else {
          return next('/home');
        }
      }
    }
    return next();
  }

  return next();
});

export default router;
