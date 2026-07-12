<!-- src/App.vue -->
<template>
  <div class="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 font-sans">
    
    <!-- MOBILE DRAWER BACKDROP (BLURRED) -->
    <div
      v-if="isLoggedIn && isMobileOpen"
      @click="isMobileOpen = false"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden no-print"
    ></div>

    <!-- SIDEBAR NAVIGATION (STRICTLY FULL-HEIGHT, FLAT, INTEGRATED AT viewport LEFT) -->
    <aside
      v-if="isLoggedIn && userRole"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      :class="[
        'fixed lg:sticky top-0 left-0 h-screen z-50 bg-forest-deep text-white transition-all duration-300 flex flex-col justify-between flex-shrink-0 no-print',
        (isCollapsed && !isMobileOpen) ? 'w-20' : 'w-64',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Navigation Menu -->
      <div class="flex flex-col gap-6">
        <!-- Sidebar Brand Header -->
        <div class="h-16 flex items-center gap-3 px-5 border-b border-white/20 select-none">
          <img src="/G.png" class="h-9 w-9 object-contain" alt="G Logo" />
          <div v-if="!isCollapsed || isMobileOpen" class="flex flex-col min-w-0">
            <span class="font-extrabold text-sm text-emerald-400 truncate max-w-[130px] leading-tight" :title="'@' + username">@{{ username }}</span>
            <span class="text-[9px] font-bold text-white/60 tracking-widest uppercase">
              {{ userRole === 'admin' ? 'Admin Portal' : 'Portal Warga' }}
            </span>
          </div>
        </div>

        <!-- Dynamic Menu Stack -->
        <nav class="flex flex-col gap-1 px-3">
          <button
            v-for="(item, key) in currentMenuItems"
            :key="key"
            @click="selectSidebarTab(key)"
            :class="[
              'flex items-center gap-3.5 transition-all duration-300 group text-left',
              (isCollapsed && !isMobileOpen) ? 'w-11 h-11 justify-center mx-auto p-0 rounded-xl' : 'w-full p-3 justify-start rounded-2xl',
              activeTab === key
                ? 'bg-emerald-500 text-slate-900 font-bold shadow-md shadow-emerald-500/20'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            ]"
            :title="item.label"
          >
            <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
            <span v-if="!isCollapsed || isMobileOpen" class="text-sm font-semibold tracking-wide">
              {{ item.label }}
            </span>
          </button>

          <!-- Logout Button — shown inside nav on mobile/tablet, right below last menu item -->
          <button
            v-if="isMobileOpen"
            @click="() => { handleLogout(); isMobileOpen = false; }"
            :class="[
              'lg:hidden flex items-center gap-3.5 transition-all duration-300 text-left w-full p-3 justify-start rounded-2xl',
              'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300'
            ]"
            title="Keluar"
          >
            <LogOutIcon class="h-5 w-5 flex-shrink-0" />
            <span class="text-sm font-semibold tracking-wide">{{ t('common.logout') }}</span>
          </button>
        </nav>
      </div>



      <!-- Sidebar Footer -->
      <div class="border-t border-white/20 p-4 select-none text-white/40 min-h-[72px] flex items-center justify-center">
        <div v-if="!isCollapsed || isMobileOpen" class="text-[10px] text-center flex flex-col gap-1.5 w-full">
          <p class="font-extrabold tracking-wider text-emerald-400 uppercase text-[8px] leading-tight">
            Popok Bukan Sampah,<br>Tapi Sumber Manfaat!
          </p>
          <p class="opacity-70 text-[9px]">© 2026 BA'PO Greenetix</p>
        </div>
        <!-- Eco-Badge icon when collapsed -->
        <div v-else class="flex items-center justify-center">
          <svg class="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 009-9C21 6 12 3 12 3S3 6 3 12a9 9 0 009 9z" />
          </svg>
        </div>
      </div>
    </aside>

    <!-- RIGHT PANEL (HEADER + MAIN CONTENT + FOOTER) -->
    <div class="flex-1 flex flex-col min-w-0">
      
      <!-- Sticky Top Header (Strictly borderless, flat) -->
      <header class="sticky top-0 z-30 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 no-print">
        <div class="px-6 h-16 flex items-center justify-between">
          
          <!-- Left: Logo, Hamburger Toggle Menu -->
          <div class="flex items-center gap-3">
            <!-- Mobile Menu Toggle hamburger -->
            <button
              v-if="isLoggedIn"
              @click="isMobileOpen = !isMobileOpen"
              class="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-900 transition-colors focus:outline-none"
              title="Toggle Menu"
            >
              <MenuIcon class="h-6 w-6" />
            </button>

            <!-- Official Greenetix Indonesia Logo text (hidden on mobile) -->
            <router-link to="/" class="hidden sm:flex items-center gap-2 group">
              <img
                src="/greenetixIndonesia.png"
                class="h-9 w-auto object-contain select-none"
                alt="Greenetix Indonesia Logo"
              />
              <span class="sr-only">BA'PO</span>
            </router-link>
          </div>

          <!-- Right Menu Controls -->
          <div class="flex items-center gap-3">
            <!-- Current User Badge -->
            <div v-if="isLoggedIn" class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div class="w-5 h-5 rounded-full bg-forest-leaf text-white flex items-center justify-center text-[10px] font-black uppercase">
                {{ username.charAt(0) }}
              </div>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">@{{ username }}</span>
              <span class="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {{ userRole }}
              </span>
            </div>
            
            <!-- Notification Center Dropdown -->
            <Dropdown v-if="isLoggedIn" align="right" class="relative">
              <template #trigger>
                <button
                  class="relative p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-900 transition-colors focus:outline-none"
                  title="Pemberitahuan"
                >
                  <BellIcon class="h-5 w-5 text-forest-leaf" />
                  <!-- Red Badge for Unread notifications -->
                  <span
                    v-if="unreadNotificationsCount > 0"
                    class="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white animate-pulse"
                  >
                    {{ unreadNotificationsCount }}
                  </span>
                </button>
              </template>
              
              <!-- Dropdown Content Container -->
              <div class="w-80 md:w-96 max-h-[80vh] flex flex-col bg-white dark:bg-slate-950 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden">
                <!-- Dropdown Header -->
                <div class="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span class="text-sm font-black text-slate-900 dark:text-slate-50">Pemberitahuan</span>
                  <button
                    v-if="notificationsList.length > 0"
                    @click="handleClearAll"
                    class="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline hover:opacity-80 transition-opacity focus:outline-none"
                  >
                    Bersihkan Semua
                  </button>
                </div>
                
                <!-- Notification List -->
                <div class="flex-1 overflow-y-auto max-h-[50vh] divide-y divide-slate-100 dark:divide-slate-900 scrollbar-thin">
                  <div v-if="notificationsList.length === 0" class="py-10 text-center flex flex-col items-center justify-center gap-2">
                    <BellIcon class="h-8 w-8 text-slate-300 dark:text-slate-700 animate-bounce" />
                    <p class="text-xs font-semibold text-slate-400 dark:text-slate-600">Belum ada pemberitahuan baru.</p>
                  </div>
                  
                  <div
                    v-else
                    v-for="notif in notificationsList"
                    :key="notif.id"
                    @click="handleMarkRead(notif.id)"
                    class="p-4 flex gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-900/30 transition-colors cursor-pointer group relative"
                    :class="[!notif.is_read ? 'bg-emerald-50/20 dark:bg-emerald-950/5' : '']"
                  >
                    <!-- Dot indicator for unread -->
                    <span v-if="!notif.is_read" class="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>

                    <!-- Icon wrapper based on type -->
                    <div class="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0"
                         :class="[
                           notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                           notif.type === 'error' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                           notif.type === 'warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                           notif.type === 'deposit' ? 'bg-forest-leaf/10 text-forest-leaf dark:text-emerald-400' :
                           notif.type === 'redemption' ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400' :
                           'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                         ]"
                    >
                      <svg v-if="notif.type === 'success'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <svg v-else-if="notif.type === 'error'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      <svg v-else-if="notif.type === 'warning'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <svg v-else-if="notif.type === 'deposit'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                      <svg v-else-if="notif.type === 'redemption'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                    
                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-start gap-1">
                        <h4 class="text-xs font-black text-slate-800 dark:text-slate-200" :class="[!notif.is_read ? 'text-slate-950 dark:text-white font-extrabold' : '']">
                          {{ notif.title }}
                        </h4>
                        <!-- Delete Button (visible on hover) -->
                        <button
                          type="button"
                          @click.stop="handleDeleteNotification(notif.id)"
                          class="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-all focus:outline-none"
                          title="Hapus pemberitahuan"
                        >
                          <TrashIcon class="h-3 w-3" />
                        </button>
                      </div>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed break-words" :class="[!notif.is_read ? 'text-slate-700 dark:text-slate-350' : '']">
                        {{ notif.message }}
                      </p>
                      <span class="text-[9px] text-slate-400 font-medium block mt-1.5">
                        {{ new Date(notif.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Dropdown>

            <!-- Language Selector (all screen sizes) -->
            <Dropdown align="right">
              <template #trigger>
                <button class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors">
                  <GlobeIcon class="h-4 w-4 text-forest-leaf" />
                  <span class="text-xs font-bold uppercase">{{ currentLocale }}</span>
                </button>
              </template>
              <div class="py-1">
                <button
                  v-for="lang in availableLanguages"
                  :key="lang.code"
                  @click="changeLanguage(lang.code)"
                  :class="[
                    'w-full text-left px-4 py-2 text-sm transition-colors duration-200',
                    currentLocale === lang.code
                      ? 'bg-emerald-50 text-forest-deep dark:bg-forest-deep/20 dark:text-emerald-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                  ]"
                >
                  {{ lang.name }}
                </button>
              </div>
            </Dropdown>

            <!-- Theme Toggle Button (all screen sizes) -->
            <button
              @click="toggleDark()"
              class="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-900 transition-colors"
              title="Ubah Tema"
            >
              <SunIcon v-if="isDark" class="h-5 w-5 text-amber-400" />
              <MoonIcon v-else class="h-5 w-5 text-forest-deep" />
            </button>

            <!-- Logout Button (desktop only) -->
            <button
              v-if="isLoggedIn"
              @click="handleLogout"
              class="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all duration-300"
            >
              <LogOutIcon class="h-4 w-4" />
              <span class="hidden sm:inline">{{ t('common.logout') }}</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Content Area (Borderless) -->
      <main :class="['flex-1 flex flex-col', activeTab === 'chat' ? 'overflow-hidden h-[calc(100vh-64px)] px-6 pt-4 pb-4 md:px-8 md:pt-4 md:pb-4' : 'px-6 pt-4 pb-6 md:px-8 md:pt-4 md:pb-8']">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>


    </div>

    <!-- Global Toast Container -->
    <Toast />
    <Dialog />
    <ChatWidget v-if="isLoggedIn && userRole === 'user'" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { useDark, useToggle } from '@vueuse/core';
import Dropdown from './components/UI/Dropdown.vue';
import Toast from './components/UI/Toast.vue';
import Dialog from './components/UI/Dialog.vue';
import ChatWidget from './components/UI/ChatWidget.vue';
import { useToast } from './composables/useToast';
import { dbService } from './services/supabase';

// Lucide Vue icons imports
import {
  Globe as GlobeIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  LogOut as LogOutIcon,
  Menu as MenuIcon,
  BarChart3 as OverviewIcon,
  ClipboardList as QueueIcon,
  FilePlus as DirectIcon,
  Users as UsersIcon,
  Settings as SettingsIcon,
  LayoutDashboard as HomeIcon,
  PlusCircle as DepositIcon,
  Gift as GiftIcon,
  MessageSquare as ChatIcon,
  History as HistoryIcon,
  Bell as BellIcon,
  Trash2 as TrashIcon
} from 'lucide-vue-next';

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const isDark = useDark();
const toggleDark = useToggle(isDark);

// States
const isCollapsed = ref(true);
const isMobileOpen = ref(false);
const username = ref('');
const isLoggedIn = ref(false);
const userRole = ref<'user' | 'admin' | null>(null);

const handleMouseEnter = () => {
  if (window.innerWidth >= 1024) {
    isCollapsed.value = false;
  }
};
const handleMouseLeave = () => {
  if (window.innerWidth >= 1024) {
    isCollapsed.value = true;
  }
};

// Get current active tab from route metadata
const activeTab = computed(() => {
  return (route.meta.tab as string) || (userRole.value === 'admin' ? 'overview' : 'home');
});

// --- Notification States & Methods ---
const notificationsList = ref<any[]>([]);
const unreadNotificationsCount = computed(() => notificationsList.value.filter(n => !n.is_read).length);

const loadNotifications = () => {
  if (!isLoggedIn.value) {
    notificationsList.value = [];
    return;
  }
  const session = dbService.getCurrentUser();
  if (session) {
    const targetId = userRole.value === 'admin' ? 'admin' : session.id;
    notificationsList.value = dbService.getNotifications(targetId);
  }
};

const handleMarkRead = (id: string) => {
  dbService.markNotificationAsRead(id);
  loadNotifications();
};

const handleDeleteNotification = (id: string) => {
  dbService.deleteNotification(id);
  loadNotifications();
};

const handleClearAll = () => {
  const session = dbService.getCurrentUser();
  if (session) {
    const targetId = userRole.value === 'admin' ? 'admin' : session.id;
    dbService.clearAllNotifications(targetId);
    loadNotifications();
  }
};

let notificationsInterval: any = null;

// Update auth states on route and mounting
const syncAuthStates = async () => {
  const session = dbService.getCurrentUser();
  isLoggedIn.value = !!session;
  
  if (session) {
    const { data: profile } = await dbService.getProfile(session.id);
    if (profile) {
      userRole.value = profile.role;
      username.value = profile.username || '';
    }
  } else {
    userRole.value = null;
    username.value = '';
  }
  loadNotifications();
};

router.afterEach(async () => {
  await syncAuthStates();
});

import { onBeforeUnmount } from 'vue';

onMounted(async () => {
  await syncAuthStates();
  notificationsInterval = setInterval(loadNotifications, 4000);
});

onBeforeUnmount(() => {
  if (notificationsInterval) {
    clearInterval(notificationsInterval);
  }
});

// Sidebar menu options based on role
const currentMenuItems = computed(() => {
  if (userRole.value === 'admin') {
    return {
      overview: { label: t('admin.tabs.overview'), icon: OverviewIcon },
      queue: { label: t('admin.tabs.queue'), icon: QueueIcon },
      directEntry: { label: t('admin.tabs.directEntry'), icon: DirectIcon },
      userManagement: { label: t('admin.tabs.userManagement'), icon: UsersIcon },
      settings: { label: t('admin.tabs.settings'), icon: SettingsIcon },
      chat: { label: t('admin.tabs.chat', 'Diskusi Warga (Chat)'), icon: ChatIcon }
    } as Record<string, { label: string; icon: any }>;
  } else {
    return {
      home: { label: t('dashboard.tabs.home', 'Dashboard'), icon: HomeIcon },
      deposit: { label: t('dashboard.tabs.deposit'), icon: DepositIcon },
      history: { label: t('dashboard.tabs.history', 'Riwayat'), icon: HistoryIcon },
      redemption: { label: t('dashboard.tabs.redemption'), icon: GiftIcon },
      settings: { label: t('admin.tabs.settings', 'Pengaturan'), icon: SettingsIcon }
    } as Record<string, { label: string; icon: any }>;
  }
});

// Handles Tab Navigation switching via clean flat URL path routing
const selectSidebarTab = (key: string) => {
  isMobileOpen.value = false;
  
  let path = '/deposit';
  if (userRole.value === 'admin') {
    if (key === 'overview') path = '/admin/overview';
    else if (key === 'queue') path = '/admin/queue';
    else if (key === 'directEntry') path = '/admin/direct';
    else if (key === 'userManagement') path = '/admin/users';
    else if (key === 'settings') path = '/admin/settings';
    else if (key === 'chat') path = '/admin/chat';
  } else {
    if (key === 'home') path = '/home';
    else if (key === 'deposit') path = '/deposit';
    else if (key === 'history') path = '/history';
    else if (key === 'redemption') path = '/redemption';
    else if (key === 'settings') path = '/settings';
    else path = '/home';
  }
  
  router.push(path);
};

// Language configurations
const availableLanguages = [
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'ko', name: '한국어 (Korean)' }
];

const currentLocale = computed(() => locale.value);

const changeLanguage = (code: string) => {
  locale.value = code;
  localStorage.setItem('locale', code);
};

const handleLogout = async () => {
  const { error } = await dbService.signOut();
  if (error) {
    toast.error('Gagal keluar', error.message);
  } else {
    isLoggedIn.value = false;
    userRole.value = null;
    toast.info('Keluar Berhasil', 'Anda telah keluar dari akun Anda.');
    router.push('/login');
  }
};
</script>
