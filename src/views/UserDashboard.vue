<!-- src/views/UserDashboard.vue -->
<template>
  <div :class="['animate-fade-in', (activeTab === 'chat' || activeTab === 'home') ? 'space-y-4' : 'space-y-8']">

    <!-- ACTIVE TAB ACTIONS -->
    <div>

      <!-- TAB HOME: DASHBOARD OVERVIEW (CLEAN & NEWS-FOCUSED) -->
      <div v-if="activeTab === 'home'" class="space-y-5">

        <!-- Combined Welcome & Stats Row (Single compact line layout) -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700/80">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span class="text-sm font-black text-slate-800 dark:text-slate-200">
              Selamat datang kembali, <span class="text-forest-leaf dark:text-forest-accent">{{ currentUser?.username }}</span>
            </span>
            <span class="hidden sm:inline text-slate-300 dark:text-slate-600">|</span>
            <span class="text-xs text-slate-500 dark:text-slate-400">
              Tarif Aktif: <span class="font-bold text-forest-leaf dark:text-forest-accent">Rp{{ sysSettings.diaper_rate }}</span>/lembar popok urine (1 poin)
            </span>
          </div>

          <!-- Stats Inline Row with Flat Icons -->
          <div class="flex items-center flex-wrap gap-4 sm:gap-6">
            <!-- 1. Diapers -->
            <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <LeafIcon class="h-4 w-4 text-forest-leaf dark:text-forest-accent flex-shrink-0" />
              <span class="font-black text-base text-slate-900 dark:text-slate-100 font-sans">{{ profile?.total_diapers || 0 }}</span>
              <span class="text-slate-500">lembar</span>
            </div>
            <span class="text-slate-200 dark:text-slate-800">|</span>
            <!-- 2. Points -->
            <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <AwardIcon class="h-4 w-4 text-amber-500 flex-shrink-0" />
              <span class="font-black text-base text-slate-900 dark:text-slate-100 font-sans">{{ profile?.total_points || 0 }}</span>
              <span class="text-slate-500">poin</span>
            </div>
            <span class="text-slate-200 dark:text-slate-800">|</span>
            <!-- 3. Rupiah -->
            <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <CoinsIcon class="h-4 w-4 text-forest-leaf dark:text-forest-accent flex-shrink-0" />
              <span class="text-slate-500">Rp</span>
              <span class="font-black text-base text-slate-900 dark:text-slate-100 font-sans">{{ formatRupiah(profile?.total_rupiah || 0) }}</span>
            </div>
          </div>
        </div>


        <!-- Announcement Slider -->
        <div v-if="announcements.length > 0" class="relative overflow-hidden rounded-2xl select-none" style="height: 200px;">
          <!-- Slides -->
          <div
            v-for="(ann, idx) in announcements"
            :key="ann.id"
            :class="[
              'absolute inset-0 transition-opacity duration-700',
              idx === sliderIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'
            ]"
          >
            <img :src="ann.image_url" :alt="ann.title" class="w-full h-full object-cover" />
            <!-- Gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
            <!-- Text -->
            <div class="absolute bottom-0 left-0 right-0 p-5 z-10">
              <p class="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-0.5">Pengumuman</p>
              <h2 class="text-sm font-black text-white leading-snug line-clamp-1">{{ ann.title }}</h2>
              <p class="text-[11px] text-white/80 mt-0.5 line-clamp-2 leading-relaxed">{{ ann.body }}</p>
            </div>
          </div>

          <!-- Dots indicator -->
          <div v-if="announcements.length > 1" class="absolute bottom-3 right-4 z-20 flex gap-1.5">
            <button
              v-for="(_, idx) in announcements"
              :key="idx"
              @click="goToSlide(idx)"
              :class="[
                'w-1.5 h-1.5 rounded-full transition-all duration-300',
                idx === sliderIdx ? 'bg-white w-4' : 'bg-white/50'
              ]"
            ></button>
          </div>

          <!-- Arrow nav -->
          <button v-if="announcements.length > 1" @click="prevSlide" class="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors backdrop-blur-sm">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button v-if="announcements.length > 1" @click="nextSlide" class="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors backdrop-blur-sm">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- Empty state if no announcements -->
        <div v-else class="rounded-2xl bg-slate-100/60 dark:bg-slate-900/30 h-32 flex flex-col items-center justify-center gap-2">
          <svg class="h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
          </svg>
          <p class="text-xs text-slate-400 font-semibold">Belum ada pengumuman dari admin</p>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
          <button @click="$router.push('/deposit')" class="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl bg-slate-100/60 dark:bg-slate-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors">
            <div class="w-8 h-8 rounded-xl bg-forest-leaf/10 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg class="h-4 w-4 text-forest-leaf dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            </div>
            <span class="text-[9px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">Setor Popok</span>
          </button>
          <button @click="$router.push('/redemption')" class="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl bg-slate-100/60 dark:bg-slate-900/40 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-colors">
            <div class="w-8 h-8 rounded-xl bg-violet-500/10 dark:bg-violet-900/30 flex items-center justify-center">
              <svg class="h-4 w-4 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
            </div>
            <span class="text-[9px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">Tukar Poin</span>
          </button>
          <button @click="isChatOpen = true" class="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl bg-slate-100/60 dark:bg-slate-900/40 hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-colors">
            <div class="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-sky-900/30 flex items-center justify-center">
              <svg class="h-4 w-4 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            </div>
            <span class="text-[9px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">Tanya Admin</span>
          </button>
        </div>

      </div>


      <!-- TAB 1: SETOR & LOKASI (CLEAN 2-COLUMN SINGLE PAGE FIT) -->
      <div v-if="activeTab === 'deposit'" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- LEFT COLUMN: Form -->
        <div class="lg:col-span-6 space-y-4">
          <div class="border-b border-slate-200 dark:border-slate-700/80 pb-2">
            <h2 class="text-base font-black text-slate-900 dark:text-slate-50 uppercase tracking-wider">
              {{ t('dashboard.depositFormTitle') }}
            </h2>
            <p class="text-xs text-slate-500 mt-1">Masukkan jumlah popok, catatan opsional, dan foto bukti setoran Anda.</p>
          </div>

          <form @submit.prevent="submitDeposit" class="space-y-4">
            <div>
              <label for="diaper-count" class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                {{ t('dashboard.diaperCountLabel') }}
              </label>
              <div class="flex items-center gap-2">
                <!-- Decrement button -->
                <button
                  type="button"
                  @click="depositForm.diaperCount = Math.max(1, depositForm.diaperCount - 1)"
                  class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-forest-leaf hover:text-white transition-colors flex items-center justify-center font-bold text-lg select-none border border-slate-200 dark:border-slate-800 focus:outline-none"
                >
                  —
                </button>
                
                <!-- Central Input -->
                <input
                  id="diaper-count"
                  v-model.number="depositForm.diaperCount"
                  type="number"
                  min="1"
                  class="flex-1 text-center py-2.5 bg-slate-100/60 dark:bg-slate-900/40 text-slate-900 dark:text-slate-50 rounded-xl focus:outline-none border border-slate-200 dark:border-slate-800 focus:border-forest-leaf font-black text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
                
                <!-- Increment button -->
                <button
                  type="button"
                  @click="depositForm.diaperCount = depositForm.diaperCount + 1"
                  class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-forest-leaf hover:text-white transition-colors flex items-center justify-center font-bold text-lg select-none border border-slate-200 dark:border-slate-800 focus:outline-none"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label for="notes" class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                {{ t('common.notes') }}
              </label>
              <textarea
                id="notes"
                v-model="depositForm.notes"
                rows="2"
                class="w-full px-3.5 py-2.5 bg-slate-100/60 dark:bg-slate-900/40 text-slate-900 dark:text-slate-50 rounded-xl focus:outline-none border border-transparent focus:border-forest-leaf text-sm resize-none"
                :placeholder="t('dashboard.notesPlaceholder')"
              ></textarea>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Foto Bukti
              </label>
              <div class="relative flex flex-col items-center justify-center py-5 px-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-100/40 dark:bg-slate-900/20 hover:border-forest-leaf transition-colors">
                <input type="file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" @change="handleFileChange" required />
                <div class="text-center space-y-1 pointer-events-none">
                  <PlusCircleIcon class="mx-auto h-6 w-6 text-slate-400" />
                  <p class="text-[10px] font-bold text-slate-500">{{ selectedFile ? selectedFile.name : 'Pilih Foto Bukti' }}</p>
                </div>
              </div>
              <div v-if="photoPreview" class="mt-2 flex items-center gap-3">
                <img :src="photoPreview" class="h-10 w-10 object-cover rounded-lg shadow-sm" alt="Preview" />
                <span class="text-[10px] text-forest-leaf dark:text-forest-accent font-bold">Berkas siap diunggah</span>
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" :loading="isSubmitting" full-width>
              {{ t('common.submit') }}
            </Button>
          </form>
        </div>

        <!-- RIGHT COLUMN: Map & Schedule -->
        <div class="lg:col-span-6 space-y-6">
          <div class="space-y-3">
            <div class="border-b border-slate-200 dark:border-slate-700/80 pb-2">
              <h2 class="text-base font-black text-slate-900 dark:text-slate-50 uppercase tracking-wider">{{ t('dashboard.dropPointMap') }}</h2>
              <p class="text-xs text-slate-500 mt-1">Gunakan peta interaktif di bawah untuk melihat lokasi pengumpulan.</p>
            </div>
            <div class="w-full h-44 rounded-2xl overflow-hidden relative z-10 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div id="drop-map" class="w-full h-full"></div>
            </div>
            <div class="space-y-0.5">
              <h3 class="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{{ t('dashboard.workshopLocation') }}</h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">{{ t('dashboard.workshopAddress') }}</p>
            </div>
          </div>

          <!-- Jadwal Operasional -->
          <div class="flex items-start gap-3 border-t border-slate-200 dark:border-slate-700/80 pt-4">
            <div class="p-2 bg-forest-light dark:bg-forest-deep/40 text-forest-deep dark:text-emerald-400 rounded-xl flex-shrink-0">
              <ClockIcon class="h-4 w-4" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-900 dark:text-slate-50 uppercase tracking-wider">{{ t('dashboard.operationalScheduleTitle') }}</h4>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{{ sysSettings.operational_schedule }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- TAB RIWAYAT: DEDICATED HISTORY LIST PAGE -->
      <div v-if="activeTab === 'history'" class="space-y-6">
        <div class="border-b border-slate-200 dark:border-slate-700/80 pb-2 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-black text-slate-900 dark:text-slate-50">Riwayat Transaksi</h2>
            <p class="text-xs text-slate-500 mt-1">Daftar lengkap riwayat setoran popok urine dan penukaran produk ekologi Anda.</p>
          </div>
          <span class="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-lg">
            {{ historySubTab === 'deposit' ? 'Setoran: ' + history.length + ' kali' : 'Penukaran: ' + redemptions.length + ' barang' }}
          </span>
        </div>

        <!-- Tab Switcher -->
        <div class="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            @click="historySubTab = 'deposit'"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none',
              historySubTab === 'deposit'
                ? 'bg-emerald-500 text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            ]"
          >
            Riwayat Setoran
          </button>
          <button
            @click="historySubTab = 'redemption'"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none',
              historySubTab === 'redemption'
                ? 'bg-emerald-500 text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            ]"
          >
            Riwayat Penukaran Poin
          </button>
        </div>

        <!-- Sub-Tab Content: Deposit History -->
        <div v-show="historySubTab === 'deposit'" class="space-y-4">
          <div v-if="isLoadingHistory" class="py-12 text-center text-sm text-slate-500">{{ t('common.loading') }}</div>
          <div v-else-if="history.length === 0" class="py-16 text-center text-sm text-slate-500 space-y-2">
            <svg class="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="font-semibold">{{ t('common.noData') }}</p>
            <p class="text-xs text-slate-400">Anda belum pernah melakukan setoran popok urine.</p>
          </div>
          <div v-else class="divide-y divide-slate-200 dark:divide-slate-700/60">
            <div v-for="item in history" :key="item.id" class="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-start gap-4">
                <button @click="openImageModal(item.photo_url)" class="h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:opacity-85 transition-opacity shadow-sm">
                  <img :src="item.photo_url" class="h-full w-full object-cover" alt="Bukti" />
                </button>
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-sm font-bold text-slate-800 dark:text-slate-200">{{ item.diaper_count }} {{ t('dashboard.diapersCollectedUnit') }}</span>
                    <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold', statusClasses(item.status)]">{{ statusText(item.status) }}</span>
                  </div>
                  <p class="text-[10px] text-slate-400">{{ formatDate(item.created_at) }}</p>
                  <p v-if="item.notes" class="text-xs text-slate-600 dark:text-slate-400 italic">"{{ item.notes }}"</p>
                  <p v-if="item.status === 'approved' && item.verified_by" class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    Diverifikasi oleh: @{{ item.verified_by }}
                  </p>
                </div>
              </div>

              <div class="sm:text-right flex sm:flex-col justify-between items-center sm:items-end gap-1.5 flex-shrink-0">
                <div v-if="item.status === 'approved'" class="text-right">
                  <div class="text-sm font-black text-forest-leaf dark:text-forest-accent">+{{ item.rupiah_earned }} {{ t('dashboard.rupiahUnit') }}</div>
                  <div class="text-[10px] font-bold text-slate-500">- {{ item.points_earned }} {{ t('dashboard.pointsBalanceUnit') }}</div>
                </div>
                <div v-else class="text-xs font-semibold text-slate-400">Verifikasi Tertunda</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sub-Tab Content: Redemption History -->
        <div v-show="historySubTab === 'redemption'" class="space-y-4">
          <div v-if="redemptions.length === 0" class="py-16 text-center text-sm text-slate-500 space-y-2">
            <svg class="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="font-semibold">Belum Ada Riwayat Penukaran</p>
            <p class="text-xs text-slate-400">Silakan tukarkan poin Anda dengan produk ekologi pada katalog.</p>
          </div>
          <div v-else class="divide-y divide-slate-200 dark:divide-slate-700/60">
            <div v-for="log in redemptions" :key="log.id" class="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-start gap-4">
                <div class="h-12 w-12 flex-shrink-0 rounded-lg bg-forest-leaf/10 dark:bg-emerald-950/40 flex items-center justify-center text-forest-leaf dark:text-emerald-400">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div class="space-y-0.5 min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">{{ log.item_name }}</h3>
                  <p class="text-[10px] text-slate-400">{{ formatDate(log.created_at) }}</p>
                  <p class="text-[9px] text-slate-400 font-mono tracking-wider">ID: {{ log.id }}</p>
                  <p v-if="log.status === 'completed' && log.verified_by" class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    Diserahkan oleh: @{{ log.verified_by }}
                  </p>
                  <button
                    @click="showReceipt(log)"
                    class="mt-1.5 text-[10px] font-bold text-forest-leaf hover:underline flex items-center gap-1 focus:outline-none"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Lihat Bukti Digital
                  </button>
                </div>
              </div>
              <div class="flex-shrink-0 sm:text-right">
                <span class="text-sm font-black text-rose-600 font-sans">
                  -{{ log.cost }} pts
                </span>
                <div
                  :class="[
                    'text-[9px] font-bold uppercase tracking-widest mt-1',
                    log.status === 'completed' ? 'text-forest-leaf dark:text-emerald-400' : 'text-amber-600 dark:text-amber-500'
                  ]"
                >
                  {{ log.status === 'completed' ? 'SUDAH DIAMBIL' : 'SIAP DIAMBIL' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>




      <!-- TAB 3: REDEEM POINTS -->
      <div v-if="activeTab === 'redemption'" class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <!-- Catalog Grid (Cardless, flat tiles with subtle separators) -->
        <div class="lg:col-span-12 space-y-6">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-slate-50 border-b border-slate-200 dark:border-slate-700/80 pb-2">{{ t('dashboard.redemption.title') }}</h2>
            <p class="text-xs text-slate-500 mt-2">{{ t('dashboard.redemption.subtitle') }}</p>
          </div>
 
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="item in catalog" :key="item.id" class="flex flex-col justify-between space-y-3 hover:scale-[1.01] transition-transform duration-200 pb-4 border-b border-slate-200 dark:border-slate-700/80 md:border-b-0">
              <img :src="item.image" class="w-full h-36 object-cover rounded-2xl shadow-sm" alt="Produk" />
              <div class="space-y-1">
                <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">{{ item.name }}</h3>
                <p class="text-[10px] text-slate-500 leading-normal">{{ item.description }}</p>
              </div>
              <div class="flex items-center justify-between pt-1 gap-2">
                <div class="text-xs">
                  <span class="font-bold text-forest-leaf dark:text-forest-accent font-sans text-sm">{{ item.cost }}</span>
                  <span class="text-slate-500 ml-1">pts</span>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <!-- Custom Stepper -->
                  <div class="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden h-7">
                    <button
                      type="button"
                      @click="redeemQuantities[item.id] = Math.max(1, (redeemQuantities[item.id] || 1) - 1)"
                      class="w-6 h-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors font-bold text-xs select-none"
                    >
                      －
                    </button>
                    <span class="w-6 text-center text-xs font-sans font-bold text-slate-800 dark:text-slate-200 select-none">
                      {{ redeemQuantities[item.id] || 1 }}
                    </span>
                    <button
                      type="button"
                      @click="redeemQuantities[item.id] = (redeemQuantities[item.id] || 1) + 1"
                      class="w-6 h-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors font-bold text-xs select-none"
                    >
                      ＋
                    </button>
                  </div>
                  <Button variant="primary" size="sm" @click="redeemProduct(item.id, redeemQuantities[item.id] || 1)">
                    Tukarkan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 5: PENGATURAN -->
      <div v-if="activeTab === 'settings'" class="w-full space-y-8 animate-fade-in">
        <div class="space-y-4">
          <h2 class="text-lg font-black text-slate-900 dark:text-slate-50 border-b border-slate-200 dark:border-slate-700/80 pb-2">
            Pengaturan Akun
          </h2>
          <p class="text-xs text-slate-500">
            Kelola informasi profil dan pengaturan keamanan akun masyarakat Anda.
          </p>
        </div>

        <!-- Ubah Kata Sandi -->
        <div class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700/80">
          <h3 class="text-sm font-bold text-slate-900 dark:text-slate-50">Ubah Kata Sandi</h3>
          <p class="text-xs text-slate-500">
            Perbarui kata sandi keamanan Anda secara berkala agar akun tetap aman.
          </p>
          <form @submit.prevent="handleChangePassword" class="space-y-4 max-w-md pt-2">
            <div>
              <label for="user-new-password" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Kata Sandi Baru
              </label>
              <input
                id="user-new-password"
                v-model="passwordForm.newPassword"
                type="password"
                class="w-full px-4 py-2.5 bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl focus:outline-none text-sm border border-slate-200 dark:border-slate-800 focus:border-forest-leaf transition-all font-sans"
                placeholder="Minimal 6 karakter"
                required
              />
            </div>
            <div>
              <label for="user-confirm-password" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                id="user-confirm-password"
                v-model="passwordForm.confirmPassword"
                type="password"
                class="w-full px-4 py-2.5 bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl focus:outline-none text-sm border border-slate-200 dark:border-slate-800 focus:border-forest-leaf transition-all font-sans"
                placeholder="Ulangi kata sandi baru"
                required
              />
            </div>
            <div class="pt-2">
              <Button type="submit" variant="primary" size="md" :loading="isUpdatingPassword">
                Perbarui Kata Sandi
              </Button>
            </div>
          </form>
        </div>
      </div>

    </div>

    <!-- Reusable Image Viewer Modal -->
    <Modal :show="isImageModalOpen" size="lg" @close="isImageModalOpen = false">
      <template #header>Pratinjau Foto Bukti Setoran</template>
      <div class="w-full flex justify-center">
        <img :src="modalImageUrl" class="rounded-2xl max-h-[70vh] w-auto object-contain shadow-md" alt="Bukti Besar" />
      </div>
      <template #footer>
        <Button variant="secondary" @click="isImageModalOpen = false">Tutup</Button>
      </template>
    </Modal>

    <!-- Digital Eco-Voucher Receipt Modal -->
    <Modal :show="isReceiptModalOpen" size="md" @close="isReceiptModalOpen = false">
      <template #header>Eco-Voucher Bukti Pengambilan</template>
      
      <div id="printable-voucher" class="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-350 dark:border-slate-700 rounded-lg flex flex-col gap-4 text-slate-800 dark:text-slate-200 shadow-sm print:border-0 print:bg-white print:text-black">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-dashed border-slate-400 dark:border-slate-600 pb-3">
          <div class="flex items-center gap-2">
            <img src="/G.png" class="h-8 w-8 object-contain" alt="G Logo" />
            <div>
              <h4 class="font-extrabold text-sm tracking-wide text-forest-leaf">BA'PO GREENETIX</h4>
              <p class="text-[9px] text-slate-400 font-bold uppercase">Eco-Voucher</p>
            </div>
          </div>
          <div
            :class="[
              'px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase',
              selectedRedemption?.status === 'completed'
                ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400'
                : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400'
            ]"
          >
            {{ selectedRedemption?.status === 'completed' ? 'Sudah Diambil' : 'Siap Diambil' }}
          </div>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span class="text-[9px] font-bold text-slate-400 uppercase block">ID Transaksi</span>
            <span class="font-mono font-bold text-slate-800 dark:text-slate-200">{{ selectedRedemption?.id }}</span>
          </div>
          <div>
            <span class="text-[9px] font-bold text-slate-400 uppercase block">Nama Masyarakat</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">@{{ selectedRedemption?.username || currentUser?.username }}</span>
          </div>
          <div>
            <span class="text-[9px] font-bold text-slate-400 uppercase block">Tanggal Penukaran</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">{{ selectedRedemption ? formatDate(selectedRedemption.created_at) : '' }}</span>
          </div>
          <div>
            <span class="text-[9px] font-bold text-slate-400 uppercase block">Metode</span>
            <span class="font-bold text-forest-leaf">Poin BA'PO</span>
          </div>
        </div>

        <!-- Details Box -->
        <div class="bg-white dark:bg-slate-950 rounded-lg p-3 border border-slate-350 dark:border-slate-700 flex items-center justify-between">
          <div class="min-w-0 flex-1">
            <span class="text-[9px] font-bold text-slate-400 uppercase block">Produk Ekologi</span>
            <span class="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight block truncate">
              {{ selectedRedemption?.item_name }}
            </span>
          </div>
          <div class="text-right flex-shrink-0">
            <span class="text-[9px] font-bold text-slate-400 uppercase block">Nilai Poin</span>
            <span class="text-xs font-black text-rose-600 font-sans">
              -{{ selectedRedemption?.cost }} pts
            </span>
          </div>
        </div>

        <!-- Simulated Barcode -->
        <div class="flex flex-col items-center gap-1">
          <div class="flex gap-0.5 justify-center h-8 select-none bg-white py-1.5 px-2 rounded-lg border border-slate-350 dark:border-slate-600">
            <div class="w-0.5 bg-black h-full"></div>
            <div class="w-1.5 bg-black h-full"></div>
            <div class="w-0.5 bg-black h-full"></div>
            <div class="w-0.5 bg-black h-full"></div>
            <div class="w-1 bg-black h-full"></div>
            <div class="w-2 bg-black h-full"></div>
            <div class="w-0.5 bg-black h-full"></div>
            <div class="w-1.5 bg-black h-full"></div>
            <div class="w-0.5 bg-black h-full"></div>
            <div class="w-2 bg-black h-full"></div>
            <div class="w-0.5 bg-black h-full"></div>
            <div class="w-1 bg-black h-full"></div>
            <div class="w-0.5 bg-black h-full"></div>
            <div class="w-1.5 bg-black h-full"></div>
            <div class="w-2 bg-black h-full"></div>
            <div class="w-0.5 bg-black h-full"></div>
            <div class="w-1 bg-black h-full"></div>
            <div class="w-0.5 bg-black h-full"></div>
            <div class="w-1.5 bg-black h-full"></div>
            <div class="w-0.5 bg-black h-full"></div>
            <div class="w-1.5 bg-black h-full"></div>
          </div>
          <span class="font-mono text-[9px] text-slate-400 tracking-[0.2em] uppercase">{{ selectedRedemption?.id }}</span>
        </div>

        <!-- Footnote Instructions -->
        <p class="text-[9px] text-slate-400 text-center leading-relaxed italic border-t border-slate-350 dark:border-slate-700 pt-2.5">
          "Tunjukkan bukti digital ini kepada petugas di Balai Pengumpulan Popok Greenetix untuk serah terima produk."
        </p>
      </div>

      <template #footer>
        <Button variant="secondary" @click="isReceiptModalOpen = false">Tutup</Button>
        <Button variant="primary" @click="printReceipt">Cetak / Simpan PDF</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch, computed, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import L from 'leaflet';
import Modal from '../components/UI/Modal.vue';
import Button from '../components/UI/Button.vue';
import { dbService, isMockMode, type Profile, type Deposit, type RedeemItem, type Redemption, type SystemSettings, type Announcement } from '../services/supabase';
import { uploadImage } from '../services/cloudinary';
import { useToast } from '../composables/useToast';
import { useDialog } from '../composables/useDialog';
import { useChatWidget } from '../composables/useChatWidget';

// Lucide Icons
import {
  PlusCircle as PlusCircleIcon,
  Clock as ClockIcon,
  Leaf as LeafIcon,
  Award as AwardIcon,
  Coins as CoinsIcon
} from 'lucide-vue-next';

const { t } = useI18n();
const route = useRoute();
const toast = useToast();
const dialog = useDialog();
const { isChatOpen } = useChatWidget();
const isMocked = ref(isMockMode);

// ── Core user state (declared early so watch(immediate) below can access currentUser) ──
const currentUser = dbService.getCurrentUser();
const profile = ref<Profile | null>(null);
const history = ref<Deposit[]>([]);
const catalog = ref<RedeemItem[]>([]);
const redemptions = ref<Redemption[]>([]);
const redeemQuantities = ref<Record<string, number>>({});
const sysSettings = ref<SystemSettings>({ diaper_rate: 50, operational_schedule: '' });
const historySubTab = ref<'deposit' | 'redemption'>('deposit');

// Switch tab dynamically based on route metadata tab
const activeTab = computed(() => (route.meta.tab as 'home' | 'deposit' | 'history' | 'redemption' | 'settings' | 'chat') || 'home');

// Announcement slider state
const announcements = ref<Announcement[]>([]);
const sliderIdx = ref(0);
let sliderInterval: any = null;

const nextSlide = () => { sliderIdx.value = (sliderIdx.value + 1) % Math.max(1, announcements.value.length); };
const prevSlide = () => { sliderIdx.value = (sliderIdx.value - 1 + Math.max(1, announcements.value.length)) % Math.max(1, announcements.value.length); };
const goToSlide = (idx: number) => { sliderIdx.value = idx; };

const startSlider = () => {
  if (sliderInterval) clearInterval(sliderInterval);
  if (announcements.value.length > 1) {
    sliderInterval = setInterval(nextSlide, 4000);
  }
};
const stopSlider = () => { if (sliderInterval) { clearInterval(sliderInterval); sliderInterval = null; } };



watch(
  activeTab,
  (newTab) => {
    if (newTab === 'deposit') {
      nextTick(() => {
        setTimeout(() => {
          initMap();
        }, 150);
      });
    }
    if (newTab === 'home') {
      startSlider();
    } else {
      stopSlider();
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  stopSlider();
});

// Page Loading States
const isLoadingHistory = ref(false);
const isSubmitting = ref(false);

// Form
const depositForm = reactive({
  diaperCount: 1,
  notes: ''
});
const selectedFile = ref<File | null>(null);
const photoPreview = ref<string | null>(null);

// Image Modal Preview
const isImageModalOpen = ref(false);
const modalImageUrl = ref('');

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID').format(val);
};

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};



const statusClasses = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-emerald-100/60 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400';
    case 'rejected':
      return 'bg-red-100/60 text-red-800 dark:bg-red-950/20 dark:text-red-400';
    case 'pending':
    default:
      return 'bg-amber-100/60 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400';
  }
};

const statusText = (status: string) => {
  switch (status) {
    case 'approved': return t('dashboard.statusApproved');
    case 'rejected': return t('dashboard.statusRejected');
    case 'pending':
    default:
      return t('dashboard.statusPending');
  }
};

const loadUserData = async () => {
  if (!currentUser) return;
  
  sysSettings.value = dbService.getSettings();

  const { data: prof } = await dbService.getProfile(currentUser.id);
  if (prof) profile.value = prof;

  isLoadingHistory.value = true;
  const { data: deps } = await dbService.getDeposits(currentUser.id);
  if (deps) history.value = deps;
  isLoadingHistory.value = false;


  catalog.value = dbService.getRedeemItems();
  catalog.value.forEach((item) => {
    if (redeemQuantities.value[item.id] === undefined) {
      redeemQuantities.value[item.id] = 1;
    }
  });

  const { data: redLog } = await dbService.getRedemptions(currentUser.id);
  if (redLog) redemptions.value = redLog;

  // Load announcements and start slider
  announcements.value = dbService.getAnnouncements();
  sliderIdx.value = 0;
  startSlider();
};

// Form Handlers
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    selectedFile.value = file;
    photoPreview.value = URL.createObjectURL(file);
  }
};

const submitDeposit = async () => {
  if (!selectedFile.value) {
    toast.warning('Unggah Foto Bukti', 'Silakan pilih foto bukti setoran popok terlebih dahulu.');
    return;
  }

  isSubmitting.value = true;
  try {
    const uploadedUrl = await uploadImage(selectedFile.value);
    const { error } = await dbService.createDeposit(
      depositForm.diaperCount,
      uploadedUrl,
      depositForm.notes || null
    );

    if (error) {
      toast.error('Gagal Mengajukan', error.message);
      return;
    }

    toast.success('Pengajuan Sukses', t('dashboard.submitSuccess'));

    depositForm.diaperCount = 1;
    depositForm.notes = '';
    selectedFile.value = null;
    photoPreview.value = null;

    await loadUserData();
  } catch (err: any) {
    toast.error('Kesalahan Unggah', err.message || 'Gagal memproses setoran.');
  } finally {
    isSubmitting.value = false;
  }
};

// Redeem Item logic
const redeemProduct = async (itemId: string, qtyInput: number = 1) => {
  if (!currentUser) return;
  
  const qty = Math.max(1, qtyInput);
  const targetItem = catalog.value.find((i) => i.id === itemId);
  if (!targetItem) return;

  const totalCost = targetItem.cost * qty;

  if (profile.value && profile.value.total_points < totalCost) {
    toast.warning('Poin Tidak Cukup', t('dashboard.redemption.insufficientPoints'));
    return;
  }

  const confirmed = await dialog.confirm('Konfirmasi Penukaran', `Apakah Anda yakin ingin menukarkan ${totalCost} poin dengan ${qty} unit "${targetItem.name}"?`);
  if (!confirmed) return;

  try {
    const { error } = await dbService.redeemItem(currentUser.id, itemId, qty);
    if (error) {
      toast.error('Gagal Penukaran', error.message);
      return;
    }

    toast.success('Penukaran Sukses', t('dashboard.redemption.success'));
    await loadUserData();
  } catch (err: any) {
    toast.error('Gagal', err.message || 'Terjadi kesalahan');
  }
};

// Modal handlers
const openImageModal = (url: string) => {
  modalImageUrl.value = url;
  isImageModalOpen.value = true;
};

// Map Initialization
let mapInstance: L.Map | null = null;
const initMap = () => {
  const coord: [number, number] = [-1.1895, 116.8640];
  
  if (mapInstance) {
    mapInstance.remove();
  }

  const map = L.map('drop-map', { zoomControl: false }).setView(coord, 14);
  mapInstance = map;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  const greenIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  L.marker(coord, { icon: greenIcon })
    .addTo(map)
    .bindPopup(`<strong class="text-forest-deep dark:text-emerald-400">Workshop Greenetix</strong><br><span class="text-xs">Jl. PDAM KM 12 Dalam</span>`)
    .openPopup();
};

// Receipt Eco-Voucher states
const selectedRedemption = ref<Redemption | null>(null);
const isReceiptModalOpen = ref(false);

const showReceipt = (log: Redemption) => {
  selectedRedemption.value = log;
  isReceiptModalOpen.value = true;
};

const printReceipt = () => {
  window.print();
};

const passwordForm = reactive({
  newPassword: '',
  confirmPassword: ''
});
const isUpdatingPassword = ref(false);

const handleChangePassword = async () => {
  if (passwordForm.newPassword.length < 6) {
    toast.warning('Kata Sandi Pendek', 'Kata sandi minimal harus 6 karakter.');
    return;
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.warning('Kata Sandi Tidak Cocok', 'Konfirmasi kata sandi tidak sesuai.');
    return;
  }

  isUpdatingPassword.value = true;
  try {
    const { error } = await dbService.changeCurrentUserPassword(passwordForm.newPassword);
    if (error) {
      toast.error('Gagal Memperbarui', error.message);
      return;
    }
    toast.success('Kata Sandi Diperbarui', 'Kata sandi Anda berhasil diperbarui.');
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch (err: any) {
    toast.error('Kesalahan', err.message || 'Gagal memperbarui kata sandi.');
  } finally {
    isUpdatingPassword.value = false;
  }
};

onMounted(() => {
  loadUserData();
  console.log('Sandbox status:', isMocked.value);
  nextTick(() => {
    setTimeout(() => {
      initMap();
    }, 200);
  });
});
</script>

<style>
@media print {
  body * {
    visibility: hidden !important;
  }
  #printable-voucher, #printable-voucher * {
    visibility: visible !important;
  }
  #printable-voucher {
    position: fixed !important;
    left: 10% !important;
    top: 5% !important;
    width: 80% !important;
    max-width: 500px !important;
    border: 1px solid #ccc !important;
    background-color: #fff !important;
    color: #000 !important;
    padding: 24px !important;
    border-radius: 16px !important;
    box-shadow: none !important;
  }
}
</style>

