<!-- src/views/AdminDashboard.vue -->
<template>
  <div :class="['animate-fade-in print:bg-white print:text-black flex flex-col', activeTab === 'chat' ? 'flex-1 h-full' : 'space-y-8']">
    


    <!-- TAB CONTENTS -->
    <div :class="['no-print flex flex-col', activeTab === 'chat' ? 'flex-1 h-full' : '']">
      
      <!-- TAB 1: IKHTISAR & STATISTIK -->
      <div v-if="activeTab === 'overview'" class="space-y-10">
        <!-- Stats Summary Grid (CARDLESS TYPOGRAPHY) -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8 py-6 border-b border-slate-200 dark:border-slate-700/80">
          <div class="flex flex-col justify-between">
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Popok</span>
            <span class="text-3xl font-black text-slate-900 dark:text-slate-50 font-sans mt-3">{{ globalStats.totalDiapers }} lembar</span>
          </div>
          <div class="flex flex-col justify-between border-l border-slate-200 dark:border-slate-700/80 pl-6 lg:pl-8">
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Kas Keluar</span>
            <span class="text-3xl font-black text-forest-leaf dark:text-forest-accent font-sans mt-3">Rp{{ formatRupiah(globalStats.totalPayout) }}</span>
          </div>
          <div class="flex flex-col justify-between lg:border-l lg:border-slate-200 lg:dark:border-slate-700/80 pl-0 lg:pl-8">
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sisa Pending</span>
            <span class="text-3xl font-black text-amber-600 dark:text-amber-500 font-sans mt-3">{{ pendingDeposits.length }} pengajuan</span>
          </div>
          <div class="flex flex-col justify-between border-l border-slate-200 dark:border-slate-700/80 pl-6 lg:pl-8">
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kontributor Aktif</span>
            <span class="text-3xl font-black text-slate-900 dark:text-slate-50 font-sans mt-3">{{ usersList.length }} warga</span>
          </div>
        </div>

        <!-- Chart Container (Flat, cardless integration) -->
        <div class="space-y-4">
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-50 border-b border-slate-200 dark:border-slate-700/80 pb-2">
            {{ t('admin.globalStatsTitle') }}
          </h2>
          <div class="w-full" @wheel.capture="handleWheel">
            <apexchart
              v-if="chartSeries.length > 0"
              type="line"
              height="325"
              :options="chartOptions"
              :series="chartSeries"
            ></apexchart>
          </div>
        </div>

        <!-- Kelola Pengumuman / News Slider -->
        <div class="space-y-5 pt-4 border-t border-slate-200 dark:border-slate-700/80">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-slate-900 dark:text-slate-50">Kelola Pengumuman (Slider Home Warga)</h2>
            <button
              @click="showAnnouncementForm = !showAnnouncementForm; editingAnnId = null; annForm = { title: '', body: '', image_url: '', image_preview: '' }"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-leaf text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Tambah Slide
            </button>
          </div>

          <!-- Form Tambah/Edit Announcement -->
          <div v-if="showAnnouncementForm" class="space-y-4 p-5 bg-slate-50/60 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-200">
              {{ editingAnnId ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru' }}
            </h3>

            <!-- Image Upload -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Foto Slide</label>
              <div class="flex gap-4 items-start">
                <label class="relative flex flex-col items-center justify-center w-32 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-forest-leaf cursor-pointer overflow-hidden flex-shrink-0 transition-colors">
                  <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleAnnImageUpload" />
                  <img v-if="annForm.image_preview" :src="annForm.image_preview" class="absolute inset-0 w-full h-full object-cover" alt="preview" />
                  <div v-else class="text-center pointer-events-none">
                    <svg class="h-6 w-6 text-slate-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p class="text-[10px] text-slate-400 mt-1">Pilih Foto</p>
                  </div>
                </label>
                <div class="flex-1 space-y-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Judul</label>
                    <input v-model="annForm.title" type="text" maxlength="80" placeholder="Judul pengumuman..." class="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-forest-leaf" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Keterangan</label>
                    <textarea v-model="annForm.body" rows="2" maxlength="300" placeholder="Isi singkat pengumuman..." class="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-forest-leaf resize-none"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-2 justify-end">
              <button @click="showAnnouncementForm = false; editingAnnId = null" class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Batal</button>
              <button @click="saveAnnouncement" :disabled="isSavingAnn || !annForm.title" class="px-4 py-2 text-xs font-bold bg-forest-leaf text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                {{ isSavingAnn ? 'Menyimpan...' : (editingAnnId ? 'Simpan Perubahan' : 'Tambahkan Slide') }}
              </button>
            </div>
          </div>

          <!-- Daftar Slides -->
          <div v-if="announcements.length === 0 && !showAnnouncementForm" class="py-8 text-center text-xs text-slate-400 font-semibold">
            Belum ada pengumuman. Klik "Tambah Slide" untuk membuat pengumuman pertama.
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="ann in announcements" :key="ann.id" class="flex gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 group">
              <img :src="ann.image_url" class="w-20 h-16 object-cover rounded-xl flex-shrink-0" :alt="ann.title" />
              <div class="flex-1 min-w-0">
                <p class="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{{ ann.title }}</p>
                <p class="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{{ ann.body }}</p>
              </div>
              <div class="flex flex-col gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="editAnnouncement(ann)" title="Edit" class="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-slate-600 dark:text-slate-400 hover:text-forest-leaf transition-colors">
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button @click="removeAnnouncement(ann.id)" title="Hapus" class="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-slate-600 dark:text-slate-400 hover:text-rose-600 transition-colors">
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- TAB 2: ANTREAN VERIFIKASI -->
      <div v-if="activeTab === 'queue'" class="space-y-6">
        <div class="border-b border-slate-200 dark:border-slate-700/80 pb-2">
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-50">
            {{ queueSubTab === 'deposit' ? t('admin.verificationQueue') : 'Antrean Pengambilan Hadiah Warga' }}
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            {{ queueSubTab === 'deposit' ? 'Verifikasi setoran popok online dari warga.' : 'Konfirmasi serah terima penukaran poin produk ekologi warga.' }}
          </p>
        </div>

        <!-- Sub-Tab Switcher -->
        <div class="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            @click="queueSubTab = 'deposit'"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none',
              queueSubTab === 'deposit'
                ? 'bg-emerald-500 text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            ]"
          >
            Antrean Setoran Popok ({{ pendingDeposits.length }})
          </button>
          <button
            @click="queueSubTab = 'redemption'"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none',
              queueSubTab === 'redemption'
                ? 'bg-emerald-500 text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            ]"
          >
            Antrean Pengambilan Hadiah ({{ redemptionsList.filter(r => r.status === 'pending').length }})
          </button>
        </div>

        <!-- 1. DEPOSIT VERIFICATION LIST -->
        <div v-show="queueSubTab === 'deposit'" class="space-y-4">
          <div v-if="isLoadingData" class="py-8 text-center text-sm text-slate-500">
            {{ t('common.loading') }}
          </div>

          <div v-else-if="pendingDeposits.length === 0" class="py-12 text-center text-sm text-slate-500 space-y-2">
            <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Semua antrean verifikasi online telah selesai diproses.</p>
          </div>

          <div v-else class="divide-y divide-slate-200 dark:divide-slate-700/60">
            <div
              v-for="item in pendingDeposits"
              :key="item.id"
              class="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div class="flex gap-4 items-start">
                <button
                  @click="openImageModal(item.photo_url)"
                  class="h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:opacity-85 transition-opacity"
                >
                  <img :src="item.photo_url" class="h-full w-full object-cover" alt="Bukti" />
                </button>
                <div class="space-y-1">
                  <span class="text-xs font-bold text-forest-leaf dark:text-forest-accent uppercase tracking-widest">
                    @{{ item.username }}
                  </span>
                  <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Setoran Popok: {{ item.diaper_count }} Lembar
                  </h3>
                  <p class="text-xs text-slate-500">
                    {{ formatDate(item.created_at) }}
                  </p>
                  <p v-if="item.notes" class="text-xs text-slate-600 dark:text-slate-400 italic">
                    "{{ item.notes }}"
                  </p>
                </div>
              </div>

              <div class="flex flex-col gap-3 min-w-[12rem] justify-between md:text-right">
                <div>
                  <label :for="'count-' + item.id" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {{ t('admin.verifyDiaperCount') }}
                  </label>
                  <input
                    :id="'count-' + item.id"
                    v-model.number="verificationForms[item.id]"
                    type="number"
                    min="1"
                    class="w-full md:w-32 px-3 py-1.5 bg-slate-100/60 dark:bg-slate-905 text-slate-900 dark:text-slate-50 rounded-xl focus:outline-none border border-slate-200 dark:border-slate-700 text-center text-sm font-bold"
                  />
                </div>

                <div class="flex items-center gap-2 mt-1">
                  <Button variant="danger" size="sm" full-width :loading="processingStates[item.id]" @click="processVerify(item.id, 'rejected')">
                    {{ t('admin.reject') }}
                  </Button>
                  <Button variant="primary" size="sm" full-width :loading="processingStates[item.id]" @click="processVerify(item.id, 'approved')">
                    {{ t('admin.approve') }}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. REDEMPTION COLLECTION LIST -->
        <div v-show="queueSubTab === 'redemption'" class="space-y-4">
          <div v-if="isLoadingData" class="py-8 text-center text-sm text-slate-500">
            {{ t('common.loading') }}
          </div>

          <div v-else-if="redemptionsList.length === 0" class="py-12 text-center text-sm text-slate-500 space-y-2">
            <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p>Belum ada riwayat pengajuan penukaran poin dari warga.</p>
          </div>

          <div v-else class="divide-y divide-slate-200 dark:divide-slate-700/60">
            <div
              v-for="item in redemptionsList"
              :key="item.id"
              class="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div class="flex items-start gap-4">
                <div class="h-12 w-12 flex-shrink-0 rounded-xl bg-forest-leaf/10 dark:bg-emerald-950/40 flex items-center justify-center text-forest-leaf dark:text-emerald-400">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div class="space-y-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-bold text-forest-leaf dark:text-forest-accent uppercase tracking-widest">
                      @{{ item.username }}
                    </span>
                    <span
                      :class="[
                        'px-2 py-0.5 rounded-full text-[9px] font-bold uppercase',
                        item.status === 'completed'
                          ? 'bg-emerald-100/60 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'bg-amber-100/60 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400'
                      ]"
                    >
                      {{ item.status === 'completed' ? 'Sudah Diambil' : 'Siap Diambil' }}
                    </span>
                  </div>
                  <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {{ item.item_name }}
                  </h3>
                  <p class="text-xs text-slate-500">
                    {{ formatDate(item.created_at) }}
                  </p>
                  <p class="text-[10px] text-slate-400 font-mono">ID Transaksi: {{ item.id }}</p>
                </div>
              </div>

              <div class="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
                <span class="text-sm font-black text-rose-600 font-sans">
                  -{{ item.cost }} pts
                </span>
                <div v-if="item.status === 'pending'" class="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    class="!bg-rose-50 dark:!bg-rose-950/20 !text-rose-600 dark:!text-rose-400 border border-rose-500/20 hover:!bg-rose-100/60 dark:hover:!bg-rose-950/40"
                    :loading="isProcessingRedeem[item.id]"
                    @click="handleRejectRedemption(item.id)"
                  >
                    Tolak
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    :loading="isProcessingRedeem[item.id]"
                    @click="handleCompleteRedemption(item.id)"
                  >
                    Konfirmasi Penyerahan
                  </Button>
                </div>
                <span v-else-if="item.status === 'completed'" class="text-xs font-semibold text-slate-400 dark:text-slate-500 flex flex-col items-end">
                  <span>Diserahkan</span>
                  <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5" v-if="item.verified_by">Oleh: @{{ item.verified_by }}</span>
                </span>
                <span v-else-if="item.status === 'rejected'" class="text-xs font-bold text-rose-600 dark:text-rose-400 flex flex-col items-end">
                  <span>Ditolak & Poin Direfund</span>
                  <span class="text-[9px] text-slate-400 font-semibold uppercase mt-0.5" v-if="item.verified_by">Oleh: @{{ item.verified_by }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: INPUT SETORAN LANGSUNG -->
      <div v-if="activeTab === 'directEntry'" class="w-full space-y-6">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-50 border-b border-slate-200 dark:border-slate-700/80 pb-2">
            {{ t('admin.directEntry.title') }}
          </h2>
          <p class="text-xs text-slate-500 mt-2">
            Gunakan form ini jika warga menyerahkan popok secara langsung tanpa gawai (HP).
          </p>
        </div>

        <form @submit.prevent="submitDirectOffline" class="space-y-4 pt-2">
          <div>
            <label for="offline-user" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              {{ t('admin.directEntry.selectUser') }}
            </label>
            <div class="relative">
              <!-- Backdrop to close dropdown -->
              <div v-if="isUserSelectOpen" class="fixed inset-0 z-10" @click="isUserSelectOpen = false"></div>
              
              <!-- Trigger Button -->
              <button
                type="button"
                id="offline-user"
                @click="isUserSelectOpen = !isUserSelectOpen"
                class="w-full px-4 py-3 bg-slate-100/60 dark:bg-slate-900/40 text-slate-900 dark:text-slate-50 rounded-2xl focus:outline-none border border-slate-200 dark:border-slate-800 focus:border-forest-leaf transition-all font-bold flex items-center justify-between text-left relative z-20"
              >
                <span>
                  {{ offlineForm.userId ? '@' + usersList.find(u => u.id === offlineForm.userId)?.username + ' (Total: ' + usersList.find(u => u.id === offlineForm.userId)?.total_diapers + ' lembar)' : t('admin.directEntry.selectUserPlaceholder') }}
                </span>
                <!-- Chevron Icon -->
                <svg class="h-4 w-4 text-slate-500 dark:text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isUserSelectOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu Panel -->
              <div
                v-if="isUserSelectOpen"
                class="absolute left-0 right-0 mt-2 z-30 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[250px]"
              >
                <!-- Search Input Area -->
                <div class="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                  <input
                    v-model="userSearchQuery"
                    type="text"
                    class="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl focus:outline-none border border-slate-200 dark:border-slate-800 focus:border-forest-leaf placeholder-slate-400 font-medium"
                    placeholder="Cari nama warga..."
                    @click.stop
                  />
                </div>

                <!-- Users List -->
                <div class="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-900/60 scrollbar-thin">
                  <button
                    v-if="filteredUsersForSelect.length === 0"
                    type="button"
                    class="w-full text-left px-4 py-3 text-xs text-slate-400 font-semibold italic cursor-default"
                  >
                    Warga tidak ditemukan
                  </button>
                  <button
                    v-else
                    v-for="user in filteredUsersForSelect"
                    :key="user.id"
                    type="button"
                    @click="selectUserForOffline(user.id)"
                    class="w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-slate-900/40 text-slate-900 dark:text-slate-50"
                    :class="{ 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400': offlineForm.userId === user.id }"
                  >
                    <span class="font-bold">@{{ user.username }}</span>
                    <span class="text-xs text-slate-400 dark:text-slate-500 font-sans">Total: {{ user.total_diapers }} lembar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label for="offline-count" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              {{ t('admin.directEntry.diaperCount') }}
            </label>
            <div class="flex items-center gap-2">
              <!-- Decrement button -->
              <button
                type="button"
                @click="offlineForm.diaperCount = Math.max(1, offlineForm.diaperCount - 1)"
                class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-forest-leaf hover:text-white transition-colors flex items-center justify-center font-bold text-lg select-none border border-slate-200 dark:border-slate-800 focus:outline-none"
              >
                —
              </button>

              <!-- Central Input -->
              <input
                id="offline-count"
                v-model.number="offlineForm.diaperCount"
                type="number"
                min="1"
                class="flex-1 text-center py-2.5 bg-slate-100/60 dark:bg-slate-900/40 text-slate-900 dark:text-slate-50 rounded-xl focus:outline-none border border-slate-200 dark:border-slate-800 focus:border-forest-leaf font-black text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />

              <!-- Increment button -->
              <button
                type="button"
                @click="offlineForm.diaperCount = offlineForm.diaperCount + 1"
                class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-forest-leaf hover:text-white transition-colors flex items-center justify-center font-bold text-lg select-none border border-slate-200 dark:border-slate-800 focus:outline-none"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label for="offline-notes" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              {{ t('admin.directEntry.notes') }}
            </label>
            <textarea
              id="offline-notes"
              v-model="offlineForm.notes"
              rows="3"
              class="w-full px-4 py-3 bg-slate-100/60 dark:bg-slate-900/40 text-slate-900 dark:text-slate-50 rounded-2xl focus:outline-none border border-slate-200 dark:border-slate-800 focus:border-forest-leaf placeholder-slate-400 transition-all"
              placeholder="Input catatan setoran fisik..."
            ></textarea>
          </div>

          <Button type="submit" variant="primary" size="md" :loading="isSubmittingOffline" full-width>
            {{ t('admin.directEntry.submitBtn') }}
          </Button>
        </form>
      </div>

      <!-- TAB 4: MANAJEMEN PENGGUNA -->
      <div v-if="activeTab === 'userManagement'" class="space-y-6">
        <div class="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 pb-4 no-print">
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-50">
            {{ t('admin.userDbTitle') }}
          </h2>
          <Button variant="primary" size="sm" @click="isCreateUserOpen = true">
            {{ t('admin.userManagement.createUserBtn') }}
          </Button>
        </div>

        <div v-if="isLoadingUsers" class="py-8 text-center text-sm text-slate-500">
          {{ t('common.loading') }}
        </div>

        <div v-else class="overflow-x-auto w-full">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr class="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800">
                <th class="pb-3">{{ t('admin.userColumn') }}</th>
                <th class="pb-3 text-center">{{ t('admin.contributionColumn') }}</th>
                <th class="pb-3 text-center">{{ t('admin.pointsColumn') }}</th>
                <th class="pb-3 text-right">{{ t('admin.rupiahColumn') }}</th>
                <th class="pb-3 text-right">{{ t('admin.joinDateColumn') }}</th>
                <th class="pb-3 text-center">{{ t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200/40 dark:divide-slate-800">
              <tr v-for="user in usersList" :key="user.id" class="text-slate-800 dark:text-slate-200">
                <td class="py-4 font-bold">@{{ user.username }}</td>
                <td class="py-4 text-center font-sans">{{ user.total_diapers }}</td>
                <td class="py-4 text-center font-sans">{{ user.total_points }}</td>
                <td class="py-4 text-right font-sans">Rp{{ formatRupiah(user.total_rupiah) }}</td>
                <td class="py-4 text-right text-slate-500">{{ formatDateShort(user.created_at) }}</td>
                <td class="py-4">
                  <div class="flex items-center justify-center gap-2">
                    <button @click="showUserHistory(user)" class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/20 text-slate-700 dark:text-slate-300 hover:text-forest-leaf transition-colors" title="Lihat Detail Riwayat">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      </svg>
                    </button>
                    <button @click="resetPassword(user.id)" class="px-2 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20" title="Reset Kata Sandi ke 123456">
                      {{ t('admin.userManagement.resetPasswordBtn') }}
                    </button>
                    <button @click="deleteAccount(user.id)" class="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400" title="Hapus User">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Create User Modal -->
        <Modal :show="isCreateUserOpen" size="md" @close="isCreateUserOpen = false">
          <template #header>{{ t('admin.userManagement.createUserTitle') }}</template>
          <div class="space-y-4 py-2">
            <p class="text-xs text-slate-500">
              {{ t('admin.userManagement.createUserSubtitle') }}
            </p>
            <div>
              <label for="new-username" class="block text-xs font-bold text-slate-500 mb-1.5">Username Warga</label>
              <input id="new-username" v-model="newUserForm.username" type="text" class="w-full px-4 py-2.5 bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl focus:outline-none border border-slate-200 dark:border-slate-800 focus:border-forest-leaf transition-all" placeholder="misal: budi_sutrisno" required />
            </div>
            <div>
              <label for="new-password" class="block text-xs font-bold text-slate-500 mb-1.5">Kata Sandi Awal</label>
              <input id="new-password" v-model="newUserForm.password" type="text" class="w-full px-4 py-2.5 bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl focus:outline-none border border-slate-200 dark:border-slate-800 focus:border-forest-leaf transition-all" required />
            </div>
          </div>
          <template #footer>
            <Button variant="secondary" @click="isCreateUserOpen = false">Batal</Button>
            <Button variant="primary" :loading="isCreatingUser" @click="submitCreateUser">Daftarkan</Button>
          </template>
        </Modal>

        <!-- Citizen History Modal -->
        <Modal :show="isHistoryOpen" size="lg" @close="isHistoryOpen = false">
          <template #header>{{ t('admin.userManagement.historyModalTitle') }} (@{{ selectedUserForHistory?.username }})</template>
          <div class="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
            <div v-if="userHistoryList.length === 0" class="py-12 text-center text-sm text-slate-500">
              User ini belum memiliki riwayat setoran.
            </div>
            <div v-else class="divide-y divide-slate-200 dark:divide-slate-700/60">
              <div v-for="item in userHistoryList" :key="item.id" class="py-3 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                <div>
                  <p class="font-bold text-sm text-slate-800 dark:text-slate-200">{{ item.diaper_count }} Popok ({{ item.status }})</p>
                  <p class="text-slate-500 font-sans mt-0.5">{{ formatDate(item.created_at) }}</p>
                  <p v-if="item.notes" class="italic mt-0.5">"{{ item.notes }}"</p>
                  <p v-if="item.status === 'approved' && item.verified_by" class="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">
                    Diverifikasi oleh: @{{ item.verified_by }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-forest-leaf font-bold">+Rp{{ formatRupiah(item.rupiah_earned) }}</p>
                  <p class="font-semibold text-slate-500">{{ item.points_earned }} poin</p>
                  <Button variant="ghost" size="sm" class="mt-1" @click="printExistingReceipt(item)">Struk</Button>
                </div>
              </div>
            </div>
          </div>
          <template #footer>
            <Button variant="secondary" @click="isHistoryOpen = false">Tutup</Button>
          </template>
        </Modal>

      </div>

      <!-- TAB 5: PENGATURAN & BACKUP SYSTEM -->
      <div v-if="activeTab === 'settings'" class="w-full space-y-8">
        
        <!-- System Parameters -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-50 border-b border-slate-200 dark:border-slate-700/80 pb-2">Pengaturan Parameter</h3>
          <div class="space-y-4">
            <div>
              <label for="diaper-rate" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                {{ t('admin.settings.diaperRateLabel') }}
              </label>
              <input
                id="diaper-rate"
                v-model.number="sysSettings.diaper_rate"
                type="number"
                min="10"
                class="w-full px-4 py-2.5 bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl focus:outline-none text-sm font-bold border border-slate-200 dark:border-slate-800 focus:border-forest-leaf transition-all"
              />
            </div>

            <div>
              <label for="ops-schedule" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                {{ t('admin.settings.operationalScheduleLabel') }}
              </label>
              <input
                id="ops-schedule"
                v-model="sysSettings.operational_schedule"
                type="text"
                class="w-full px-4 py-2.5 bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl focus:outline-none text-sm border border-slate-200 dark:border-slate-800 focus:border-forest-leaf transition-all"
              />
            </div>

            <div class="flex flex-wrap gap-3 pt-2">
              <Button variant="primary" size="md" @click="saveSystemSettings">
                {{ t('admin.settings.saveSettingsBtn') }}
              </Button>
              <Button variant="secondary" size="md" @click="triggerReportPrint">
                {{ t('admin.reports.printReportBtn') }}
              </Button>
            </div>
          </div>
        </div>

        <!-- Database Backups -->
        <div class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700/80">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-50">Cadangkan & Pemulihan (Backup JSON)</h3>
          <p class="text-xs text-slate-500">
            Ekspor rekam medis data bank popok untuk backup fisik atau impor untuk memulihkan sandbox.
          </p>
          <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Button variant="secondary" size="md" full-width @click="handleExportBackup">
              {{ t('admin.settings.exportBtn') }}
            </Button>
            
            <div class="relative w-full">
              <input
                type="file"
                accept=".json"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                @change="handleImportBackup"
              />
              <Button variant="ghost" size="md" full-width class="border border-dashed border-slate-400">
                {{ t('admin.settings.importBtn') }}
              </Button>
            </div>
          </div>
        </div>

        <!-- Ubah Kata Sandi -->
        <div class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700/80">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-50">Ubah Kata Sandi</h3>
          <p class="text-xs text-slate-500">
            Perbarui kata sandi keamanan portal admin Anda secara berkala.
          </p>
          <form @submit.prevent="handleChangePassword" class="space-y-4 max-w-md pt-2">
            <div>
              <label for="admin-new-password" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Kata Sandi Baru
              </label>
              <input
                id="admin-new-password"
                v-model="passwordForm.newPassword"
                type="password"
                class="w-full px-4 py-2.5 bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl focus:outline-none text-sm border border-slate-200 dark:border-slate-800 focus:border-forest-leaf transition-all font-sans"
                placeholder="Minimal 6 karakter"
                required
              />
            </div>
            <div>
              <label for="admin-confirm-password" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                id="admin-confirm-password"
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

      <div v-if="activeTab === 'chat'" class="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch flex-1 min-h-[380px]">

        <!-- LEFT COLUMN: Citizen List (borderless) -->
        <div
          :class="[
            'md:flex flex-col md:col-span-4 border-r border-slate-200 dark:border-slate-700/80 overflow-hidden',
            activeChatUserId ? 'hidden' : 'flex'
          ]"
        >

          <!-- Section Title -->
          <div class="pb-3 mb-1">
            <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Daftar Percakapan</h3>
          </div>

          <!-- Search Warga -->
          <div class="mb-3 pr-4">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
              </svg>
              <input
                v-model="chatSearchQuery"
                type="text"
                class="w-full pl-8 pr-3 py-2 text-xs bg-slate-100/60 dark:bg-slate-900/40 text-slate-900 dark:text-slate-50 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-forest-leaf placeholder-slate-400 font-medium"
                placeholder="Cari nama warga..."
              />
            </div>
          </div>

          <!-- User List -->
          <div class="flex-1 overflow-y-auto no-scrollbar pr-1 space-y-0.5">
            <div v-if="filteredUsersForChat.length === 0" class="py-8 text-center text-xs text-slate-400 font-semibold italic">
              Warga tidak ditemukan
            </div>
            <button
              v-else
              v-for="user in filteredUsersForChat"
              :key="user.id"
              @click="loadChatMessagesForUser(user.id)"
              class="w-full text-left px-3 py-3.5 rounded-2xl transition-all flex items-start gap-3 group"
              :class="activeChatUserId === user.id
                ? 'bg-emerald-50 dark:bg-emerald-950/25'
                : 'hover:bg-slate-100/70 dark:hover:bg-slate-900/40'"
            >
              <!-- Avatar circle -->
              <div :class="['w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black uppercase', activeChatUserId === user.id ? 'bg-forest-leaf text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300']">
                {{ user.username.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <p :class="['text-sm font-bold truncate', activeChatUserId === user.id ? 'text-emerald-800 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200']">
                  @{{ user.username }}
                </p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                  Total: {{ user.total_diapers }} lembar popok
                </p>
              </div>
              <!-- Active indicator dot -->
              <div v-if="activeChatUserId === user.id" class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
            </button>
          </div>
        </div>

        <!-- RIGHT COLUMN: Chat Area (borderless) -->
        <div
          :class="[
            'md:flex flex-col md:col-span-8 overflow-hidden pl-0 md:pl-6',
            activeChatUserId ? 'flex' : 'hidden'
          ]"
        >

          <!-- Empty State -->
          <div v-if="!activeChatUserId" class="flex-1 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 space-y-3 py-16">
            <svg class="h-14 w-14 opacity-50" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div class="text-center">
              <p class="text-xs font-bold text-slate-400 dark:text-slate-500">Pilih warga dari panel kiri</p>
              <p class="text-[10px] text-slate-300 dark:text-slate-600 mt-1">untuk memulai atau melanjutkan percakapan</p>
            </div>
          </div>

          <template v-else>
            <!-- Chat Header (borderless) -->
            <div class="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700/80 mb-4">
              <!-- Back button for mobile -->
              <button
                @click="activeChatUserId = null"
                class="md:hidden p-2 -ml-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 mr-1"
                title="Kembali ke Daftar Warga"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div class="w-10 h-10 rounded-full bg-forest-leaf text-white flex items-center justify-center text-sm font-black uppercase flex-shrink-0">
                {{ usersList.find(u => u.id === activeChatUserId)?.username?.charAt(0) }}
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-black text-slate-900 dark:text-slate-50">
                  @{{ usersList.find(u => u.id === activeChatUserId)?.username }}
                </h3>
                <span class="text-[10px] text-slate-500 font-medium">Percakapan Bantuan Operasional</span>
              </div>
              <div class="flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                Aktif
              </div>
            </div>

            <!-- Messages List -->
            <div ref="chatContainerRef" class="flex-1 overflow-y-auto no-scrollbar space-y-5 pb-2">
              <div v-if="chatMessages.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <p class="text-xs font-semibold">Belum ada riwayat percakapan.</p>
              </div>
              <div
                v-else
                v-for="msg in chatMessages"
                :key="msg.id"
                :class="['flex flex-col max-w-[72%]', msg.sender_id === currentUser?.id ? 'ml-auto items-end' : 'mr-auto items-start']"
              >
                <span
                  class="text-[10px] font-bold mb-1"
                  :class="isAdminSender(msg) ? 'text-forest-leaf dark:text-forest-accent font-black' : 'text-slate-400 dark:text-slate-500'"
                >
                  {{ msg.sender_id === currentUser?.id ? 'Anda' : '@' + msg.sender_username }}
                </span>
                <!-- Image attachment bubble -->
                <template v-if="msg.message.startsWith('data:image/')">
                  <img
                    :src="msg.message"
                    class="max-w-[240px] rounded-2xl shadow-sm cursor-pointer"
                    :class="msg.sender_id === currentUser?.id ? 'rounded-tr-sm' : 'rounded-tl-sm'"
                    alt="Lampiran gambar"
                  />
                </template>
                <!-- Regular text or file bubble -->
                <div v-else :class="[
                  'px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed',
                  msg.sender_id === currentUser?.id
                    ? 'bg-forest-leaf text-white rounded-tr-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tl-sm'
                ]">
                  <template v-if="msg.message.startsWith('📎')">
                    <div class="flex items-center gap-2">
                      <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span class="text-xs">{{ msg.message.replace('📎 ', '') }}</span>
                    </div>
                  </template>
                  <template v-else>{{ msg.message }}</template>
                </div>
                <span class="text-[9px] text-slate-400 mt-1 px-1">{{ formatDateShort(msg.created_at) }}</span>
              </div>
            </div>

            <!-- Attachment Preview Banner -->
            <div v-if="adminAttachmentName" class="flex items-center gap-2 py-2 px-3 mb-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 dark:border-emerald-900/50">
              <!-- Image thumbnail preview -->
              <img v-if="adminAttachmentIsImage && adminAttachmentDataUrl" :src="adminAttachmentDataUrl" class="h-10 w-10 rounded-lg object-cover flex-shrink-0 shadow" alt="Preview" />
              <svg v-else class="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span class="truncate flex-1">{{ adminAttachmentName }}</span>
              <button type="button" @click="clearAttachment" class="text-rose-400 hover:text-rose-600 font-black ml-auto flex-shrink-0">✕</button>
            </div>

            <!-- Chat Input Area (borderless, elevated style) -->
            <div class="pt-3 border-t border-slate-200 dark:border-slate-700/80">
              <div class="flex items-end gap-2 bg-slate-100/60 dark:bg-slate-900/40 rounded-2xl px-3 py-2 border border-slate-200 dark:border-slate-800 focus-within:border-forest-leaf transition-all">
                <!-- File Attachment Button -->
                <label class="cursor-pointer flex-shrink-0 mb-0.5" title="Lampirkan file">
                  <input
                    ref="adminAttachmentFileRef"
                    type="file"
                    class="hidden"
                    @change="handleAdminAttachment"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                  />
                  <svg class="h-5 w-5 text-slate-400 hover:text-forest-leaf transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </label>

                <!-- Text Input -->
                <input
                  v-model="newAdminMessageText"
                  @keydown.enter="sendAdminMessage"
                  type="text"
                  class="flex-1 text-sm bg-transparent text-slate-900 dark:text-slate-50 focus:outline-none placeholder-slate-400 py-1.5"
                  placeholder="Tulis balasan Anda..."
                  :disabled="isSendingAdminMessage"
                />

                <!-- Send Button -->
                <button
                  type="button"
                  @click="sendAdminMessage"
                  :disabled="isSendingAdminMessage || !newAdminMessageText.trim()"
                  class="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                  :class="newAdminMessageText.trim() ? 'bg-forest-leaf text-white shadow-sm hover:bg-emerald-700' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'"
                >
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </div>
              <p class="text-[9px] text-slate-400 mt-1.5 px-1">Tekan Enter atau ikon kirim untuk mengirim pesan</p>
            </div>
          </template>
        </div>
      </div>

    </div>

    <!-- ======================================================= -->
    <!-- THERMAL RECEIPT SLIP PRINT-ONLY STRUCTURE -->
    <!-- ======================================================= -->
    <div
      v-if="activeReceipt"
      id="print-receipt"
      :class="[
        'hidden p-4 max-w-[80mm] mx-auto text-xs font-mono border border-slate-300',
        printMode === 'receipt' ? 'print:block print-area-active' : ''
      ]"
    >
      <div class="text-center border-b-2 border-dashed border-black pb-3 mb-3 space-y-1">
        <h1 class="text-base font-extrabold tracking-wide uppercase text-black">BA'PO GREENETIX</h1>
        <p class="text-[10px] leading-tight text-black">Balai Pengumpulan POPOK Indonesia</p>
        <p class="text-[9px] text-black">Drop Point KM 12 Balikpapan</p>
      </div>

      <div class="space-y-1.5 text-[10px] text-black">
        <div>
          <span class="font-bold">Date:</span> {{ formatDate(activeReceipt.created_at) }}
        </div>
        <div>
          <span class="font-bold">Tx ID:</span> {{ activeReceipt.id }}
        </div>
        <div class="border-b border-slate-300 pb-1 mb-1">
          <span class="font-bold">Citizen:</span> @{{ activeReceipt.username }}
        </div>
        <div class="flex justify-between font-bold text-sm">
          <span>Diapers (Qty):</span>
          <span>{{ activeReceipt.diaper_count }} pcs</span>
        </div>
        <div class="flex justify-between">
          <span>Points Earned:</span>
          <span>+{{ activeReceipt.points_earned }} pts</span>
        </div>
        <div class="flex justify-between border-b border-black pb-1 mb-1 text-sm font-bold">
          <span>Cash Conversion:</span>
          <span>Rp{{ formatRupiah(activeReceipt.rupiah_earned) }}</span>
        </div>
      </div>

      <div class="mt-4 text-center leading-normal text-[9px] italic border-b border-dashed border-black pb-4 mb-4 text-black">
        "{{ activeReceipt.notes || 'Setoran Berhasil Diverifikasi' }}"
      </div>

      <div class="grid grid-cols-2 text-center text-[9px] gap-4 mb-6 text-black">
        <div>
          <p class="mb-8">Warga</p>
          <p class="border-t border-black pt-1">@{{ activeReceipt.username }}</p>
        </div>
        <div>
          <p class="mb-8">Petugas</p>
          <p class="border-t border-black pt-1">@{{ activeReceipt.verified_by || 'Staff' }}</p>
        </div>
      </div>

      <div class="text-center text-[9px] font-bold uppercase leading-tight tracking-wider text-black">
        {{ t('admin.receipt.slogan') }}
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- FORMAL MONTHLY REPORT PRINT-ONLY STRUCTURE -->
    <!-- ======================================================= -->
    <div
      id="print-report"
      :class="[
        'hidden p-8 mx-auto text-black font-sans text-xs bg-white',
        printMode === 'report' ? 'print:block print-area-active' : ''
      ]"
    >
      <div class="text-center border-b-2 border-black pb-4 mb-6">
        <h1 class="text-xl font-black uppercase tracking-wider text-black">{{ t('admin.reports.monthlyReportTitle') }}</h1>
        <p class="text-sm font-semibold text-slate-700">Workshop & Kantor Greenetix Indonesia - Balikpapan</p>
        <p class="text-xs text-slate-500 font-mono mt-1">Tanggal Cetak: {{ formatDateShort(new Date().toISOString()) }}</p>
      </div>

      <div class="mb-6 text-black">
        <h3 class="text-sm font-bold uppercase border-b border-slate-300 pb-1 mb-3">I. Ringkasan Kinerja Global</h3>
        <table class="w-full border-collapse border border-slate-300 text-left">
          <tbody>
            <tr class="border-b border-slate-300">
              <th class="p-2 bg-slate-100 font-bold w-1/2">Total Pengajuan</th>
              <td class="p-2 font-mono">{{ deposits.length }} kali</td>
            </tr>
            <tr class="border-b border-slate-300">
              <th class="p-2 bg-slate-100 font-bold">Setoran Disetujui</th>
              <td class="p-2 font-mono text-emerald-800 font-bold">{{ deposits.filter(d => d.status === 'approved').length }} kali</td>
            </tr>
            <tr class="border-b border-slate-300">
              <th class="p-2 bg-slate-100 font-bold">Volume Popok Urine Dikumpulkan</th>
              <td class="p-2 font-mono font-bold">{{ globalStats.totalDiapers }} lembar</td>
            </tr>
            <tr>
              <th class="p-2 bg-slate-100 font-bold">Total Pembayaran Kas Kontributor</th>
              <td class="p-2 font-mono font-bold text-amber-700">Rp{{ formatRupiah(globalStats.totalPayout) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mb-6 text-black">
        <h3 class="text-sm font-bold uppercase border-b border-slate-300 pb-1 mb-3">II. Kontributor Warga Teraktif</h3>
        <table class="w-full border-collapse border border-slate-300 text-left">
          <thead>
            <tr class="bg-slate-100 border-b border-slate-300 font-bold text-center">
              <th class="p-2 w-16">No</th>
              <th class="p-2 text-left">Username</th>
              <th class="p-2">Diapers</th>
              <th class="p-2 text-right">Kas Diterima</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(usr, idx) in usersList.slice(0, 3)" :key="usr.id" class="border-b border-slate-200">
              <td class="p-2 text-center font-mono">{{ idx + 1 }}</td>
              <td class="p-2 font-bold">@{{ usr.username }}</td>
              <td class="p-2 text-center font-mono">{{ usr.total_diapers }} pcs</td>
              <td class="p-2 text-right font-mono font-bold">Rp{{ formatRupiah(usr.total_rupiah) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="text-black">
        <h3 class="text-sm font-bold uppercase border-b border-slate-300 pb-1 mb-3">III. Jurnal Transaksi Setoran Disetujui</h3>
        <table class="w-full border-collapse border border-slate-300 text-left text-[10px]">
          <thead>
            <tr class="bg-slate-100 border-b border-slate-300 font-bold text-center">
              <th class="p-2 text-left">Tanggal</th>
              <th class="p-2 text-left">Username</th>
              <th class="p-2">Popok (Qty)</th>
              <th class="p-2 text-right">Rupiah (Kas)</th>
              <th class="p-2">Petugas Verifikator</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in deposits.filter(d => d.status === 'approved')" :key="item.id" class="border-b border-slate-200">
              <td class="p-2 font-mono">{{ formatDateShort(item.created_at) }}</td>
              <td class="p-2">@{{ item.username }}</td>
              <td class="p-2 text-center font-mono">{{ item.diaper_count }} pcs</td>
              <td class="p-2 text-right font-mono font-bold">Rp{{ formatRupiah(item.rupiah_earned) }}</td>
              <td class="p-2 text-center font-bold text-slate-600">@{{ item.verified_by || 'Staff' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-12 flex justify-end gap-12 text-center text-black">
        <div class="w-48">
          <p class="mb-14 text-xs">Balikpapan, {{ formatDateShort(new Date().toISOString()) }}</p>
          <p class="font-bold text-xs border-t border-black pt-1">Kepala Balai BA'PO</p>
        </div>
      </div>
    </div>

    <!-- SCREEN ONLY RECEIPT VIEWER POPUP -->
    <Modal :show="isReceiptOpen" size="sm" @close="isReceiptOpen = false">
      <template #header>Slip Cetak Resi Setoran</template>
      <div class="bg-slate-100 p-4 rounded-2xl text-xs font-mono text-slate-800 space-y-3 shadow-inner">
        <div class="text-center border-b border-dashed border-slate-400 pb-2">
          <h4 class="font-extrabold uppercase">BA'PO GREENETIX</h4>
          <p class="text-[10px]">Balai Pengumpulan POPOK</p>
        </div>
        <div class="space-y-1 text-[10px]">
          <p><strong>{{ t('admin.receipt.date') }}:</strong> {{ activeReceipt ? formatDate(activeReceipt.created_at) : '' }}</p>
          <p class="truncate"><strong>{{ t('admin.receipt.transactionId') }}:</strong> {{ activeReceipt?.id }}</p>
          <p><strong>{{ t('admin.receipt.name') }}:</strong> @{{ activeReceipt?.username }}</p>
          <p class="border-b border-slate-300 pb-1 mb-1"></p>
          <p class="flex justify-between font-bold"><span>{{ t('admin.receipt.amount') }}:</span> <span>{{ activeReceipt?.diaper_count }} lembar</span></p>
          <p class="flex justify-between"><span>{{ t('admin.receipt.points') }}:</span> <span>+{{ activeReceipt?.points_earned }} pts</span></p>
          <p class="flex justify-between font-bold text-emerald-800"><span>{{ t('admin.receipt.rupiah') }}:</span> <span>Rp{{ activeReceipt ? formatRupiah(activeReceipt.rupiah_earned) : 0 }}</span></p>
        </div>
      </div>
      <template #footer>
        <Button variant="secondary" @click="isReceiptOpen = false">Tutup</Button>
        <Button variant="primary" @click="triggerReceiptPrint">Cetak Struk</Button>
      </template>
    </Modal>

    <!-- Reusable Image Viewer Modal -->
    <Modal :show="isImageModalOpen" size="lg" @close="isImageModalOpen = false">
      <template #header>Pratinjau Foto Bukti Setoran</template>
      <div class="w-full flex justify-center">
        <img :src="modalImageUrl" class="rounded-2xl max-h-[70vh] w-auto object-contain shadow-md" alt="Bukti Setoran" />
      </div>
      <template #footer>
        <Button variant="secondary" @click="isImageModalOpen = false">Tutup</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, onBeforeUnmount, nextTick, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Modal from '../components/UI/Modal.vue';
import Button from '../components/UI/Button.vue';
import { dbService, isMockMode, type Profile, type Deposit, type SystemSettings, type ChatMessage, type Announcement, type Redemption } from '../services/supabase';
import { useToast } from '../composables/useToast';
import { useDialog } from '../composables/useDialog';

const { t } = useI18n();
const route = useRoute();
const toast = useToast();
const dialog = useDialog();

const isMocked = ref(isMockMode);
const currentUser = dbService.getCurrentUser();

// State - computed tab from route metadata
const activeTab = computed(() => (route.meta.tab as 'overview' | 'queue' | 'directEntry' | 'userManagement' | 'settings' | 'chat') || 'overview');

// ── Core data (declared early so computed/watch below can access them) ──
const deposits = ref<Deposit[]>([]);
const usersList = ref<Profile[]>([]);
const redemptionsList = ref<Redemption[]>([]);
const queueSubTab = ref<'deposit' | 'redemption'>('deposit');
const sysSettings = ref<SystemSettings>({ diaper_rate: 50, operational_schedule: '' });

// Announcement state
const announcements = ref<Announcement[]>([]);
const showAnnouncementForm = ref(false);
const editingAnnId = ref<string | null>(null);
const isSavingAnn = ref(false);
const annForm = ref({ title: '', body: '', image_url: '', image_preview: '' });

const handleAnnImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      annForm.value.image_url = e.target?.result as string;
      annForm.value.image_preview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const saveAnnouncement = async () => {
  if (!annForm.value.title.trim()) return;
  if (!annForm.value.image_url) {
    toast.error('Foto diperlukan', 'Pilih foto untuk slide pengumuman.');
    return;
  }
  isSavingAnn.value = true;
  const { data, error } = await dbService.upsertAnnouncement({
    id: editingAnnId.value || undefined,
    title: annForm.value.title.trim(),
    body: annForm.value.body.trim(),
    image_url: annForm.value.image_url
  });
  isSavingAnn.value = false;
  if (data) {
    toast.success('Berhasil', editingAnnId.value ? 'Pengumuman diperbarui.' : 'Slide pengumuman ditambahkan.');
    announcements.value = dbService.getAnnouncements();
    showAnnouncementForm.value = false;
    editingAnnId.value = null;
    annForm.value = { title: '', body: '', image_url: '', image_preview: '' };
  } else {
    toast.error('Gagal', error?.message || 'Gagal menyimpan pengumuman.');
  }
};

const editAnnouncement = (ann: Announcement) => {
  editingAnnId.value = ann.id;
  annForm.value = { title: ann.title, body: ann.body, image_url: ann.image_url, image_preview: ann.image_url };
  showAnnouncementForm.value = true;
};

const removeAnnouncement = async (id: string) => {
  const { error } = await dbService.deleteAnnouncement(id);
  if (!error) {
    announcements.value = dbService.getAnnouncements();
    toast.success('Dihapus', 'Slide pengumuman telah dihapus.');
  }
};

// Admin Chat States
const chatMessages = ref<ChatMessage[]>([]);
const isAdminSender = (msg: any) => {
  return msg.sender_id.startsWith('admin-') || ['admin_bapo', 'greenetix_admin', 'rohman'].includes(msg.sender_username);
};
const activeChatUserId = ref<string | null>(null);
const newAdminMessageText = ref('');
const isSendingAdminMessage = ref(false);
const chatContainerRef = ref<HTMLElement | null>(null);
let adminChatPollInterval: any = null;

// Chat Search & Attachment State
const chatSearchQuery = ref('');
const filteredUsersForChat = computed(() => {
  const q = chatSearchQuery.value.toLowerCase().trim();
  if (!q) return usersList.value;
  return usersList.value.filter(u => u.username.toLowerCase().includes(q));
});
const adminAttachmentFileRef = ref<HTMLInputElement | null>(null);
const adminAttachmentName = ref('');
const adminAttachmentDataUrl = ref<string | null>(null);
const adminAttachmentIsImage = ref(false);

const loadChatMessagesForUser = (userId: string) => {
  activeChatUserId.value = userId;
  chatMessages.value = dbService.getChatMessages(userId);
  scrollToBottom();
};

const sendAdminMessage = async () => {
  if (!activeChatUserId.value || !currentUser) return;
  // Send image dataUrl if image is attached, else send text
  const messageToSend = adminAttachmentIsImage.value && adminAttachmentDataUrl.value
    ? adminAttachmentDataUrl.value
    : newAdminMessageText.value.trim();
  if (!messageToSend) return;

  isSendingAdminMessage.value = true;
  const { data, error } = await dbService.sendChatMessage(
    activeChatUserId.value,
    currentUser.id,
    currentUser.username,
    messageToSend
  );
  isSendingAdminMessage.value = false;
  if (data) {
    newAdminMessageText.value = '';
    clearAttachment();
    loadChatMessagesForUser(activeChatUserId.value);
  } else {
    toast.error('Gagal Kirim', error?.message || 'Gagal mengirim pesan chat.');
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
  });
};

const handleAdminAttachment = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    adminAttachmentName.value = file.name;
    adminAttachmentIsImage.value = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = (e) => { adminAttachmentDataUrl.value = e.target?.result as string; };
    reader.readAsDataURL(file);
    if (!newAdminMessageText.value.trim() && !adminAttachmentIsImage.value) {
      newAdminMessageText.value = `📎 ${file.name}`;
    }
    toast.success('File Dipilih', `File "${file.name}" siap dikirim bersama pesan.`);
  }
};

const clearAttachment = () => {
  adminAttachmentName.value = '';
  adminAttachmentDataUrl.value = null;
  adminAttachmentIsImage.value = false;
  if (adminAttachmentFileRef.value) adminAttachmentFileRef.value.value = '';
};

watch(
  activeTab,
  (newTab) => {
    if (newTab === 'chat') {
      // Load first user if available
      if (usersList.value.length > 0 && !activeChatUserId.value) {
        loadChatMessagesForUser(usersList.value[0].id);
      }
      adminChatPollInterval = setInterval(() => {
        if (activeChatUserId.value) {
          chatMessages.value = dbService.getChatMessages(activeChatUserId.value);
        }
      }, 3000);
    } else {
      if (adminChatPollInterval) {
        clearInterval(adminChatPollInterval);
        adminChatPollInterval = null;
      }
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (adminChatPollInterval) {
    clearInterval(adminChatPollInterval);
  }
});

// Loading variables
const isLoadingData = ref(false);
const isLoadingUsers = ref(false);
const isSubmittingOffline = ref(false);

// Local input & loading tracking for verification items
const verificationForms = reactive<Record<string, number>>({});
const processingStates = reactive<Record<string, boolean>>({});

// Offline Form
const offlineForm = reactive({
  userId: '',
  diaperCount: 10,
  notes: ''
});

// Custom Select User Dropdown States
const isUserSelectOpen = ref(false);
const userSearchQuery = ref('');
const filteredUsersForSelect = computed(() => {
  const query = userSearchQuery.value.toLowerCase().trim();
  if (!query) return usersList.value;
  return usersList.value.filter(u => u.username.toLowerCase().includes(query));
});
const selectUserForOffline = (userId: string) => {
  offlineForm.userId = userId;
  isUserSelectOpen.value = false;
  userSearchQuery.value = '';
};

// Create User Form
const isCreateUserOpen = ref(false);
const isCreatingUser = ref(false);
const newUserForm = reactive({
  username: '',
  password: 'password123'
});

// Citizen History list modal
const isHistoryOpen = ref(false);
const selectedUserForHistory = ref<Profile | null>(null);
const userHistoryList = ref<Deposit[]>([]);

// Printing control state
const printMode = ref<'receipt' | 'report'>('receipt');
const isReceiptOpen = ref(false);
const activeReceipt = ref<Deposit | null>(null);

// Image Modal Preview
const isImageModalOpen = ref(false);
const modalImageUrl = ref('');

const pendingDeposits = computed(() => {
  return deposits.value.filter((d) => d.status === 'pending');
});

// Calculations for Overview Tab
const globalStats = computed(() => {
  const approved = deposits.value.filter(d => d.status === 'approved');
  const diapers = approved.reduce((acc, curr) => acc + curr.diaper_count, 0);
  const payout = approved.reduce((acc, curr) => acc + curr.rupiah_earned, 0);
  return {
    totalDiapers: diapers,
    totalPayout: payout
  };
});

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

const formatDateShort = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const openImageModal = (url: string) => {
  modalImageUrl.value = url;
  isImageModalOpen.value = true;
};

// Data loading
const loadData = async () => {
  isLoadingData.value = true;
  isLoadingUsers.value = true;
  
  sysSettings.value = dbService.getSettings();

  try {
    const { data: deps } = await dbService.getDeposits();
    if (deps) {
      deposits.value = deps;
      deps.forEach((d) => {
        if (d.status === 'pending' && verificationForms[d.id] === undefined) {
          verificationForms[d.id] = d.diaper_count;
        }
      });
    }

    const { data: usrs } = await dbService.getAllProfiles();
    if (usrs) usersList.value = usrs;

    const { data: reds } = await dbService.getRedemptions();
    if (reds) redemptionsList.value = reds;
  } catch (err) {
    console.error('Error loading admin dashboard', err);
  } finally {
    isLoadingData.value = false;
    isLoadingUsers.value = false;
  }

  // Load announcements (sync)
  announcements.value = dbService.getAnnouncements();
};

const isProcessingRedeem = reactive<Record<string, boolean>>({});

const handleCompleteRedemption = async (redemptionId: string) => {
  const confirmed = await dialog.confirm('Konfirmasi Penyerahan', 'Apakah Anda yakin ingin mengonfirmasi bahwa warga sudah mengambil barang ini secara fisik?');
  if (!confirmed) return;

  isProcessingRedeem[redemptionId] = true;
  try {
    const { error } = await dbService.completeRedemption(redemptionId, currentUser?.id || 'admin-uuid-1');
    if (error) {
      toast.error('Gagal memproses', error.message);
      return;
    }
    toast.success('Konfirmasi Sukses', 'Barang penukaran poin berhasil ditandai sebagai diserahkan.');
    await loadData();
  } catch (err: any) {
    toast.error('Kesalahan', err.message || 'Terjadi kesalahan');
  } finally {
    isProcessingRedeem[redemptionId] = false;
  }
};

const handleRejectRedemption = async (redemptionId: string) => {
  const confirmed = await dialog.confirm('Tolak Penukaran Poin', 'Apakah Anda yakin ingin menolak pengajuan penukaran poin ini? Poin warga akan dikembalikan secara utuh.');
  if (!confirmed) return;

  isProcessingRedeem[redemptionId] = true;
  try {
    const { error } = await dbService.rejectRedemption(redemptionId, currentUser?.id || 'admin-uuid-1');
    if (error) {
      toast.error('Gagal memproses', error.message);
      return;
    }
    toast.success('Penukaran Ditolak', 'Pengajuan penukaran poin berhasil ditolak dan poin warga telah dikembalikan.');
    await loadData();
  } catch (err: any) {
    toast.error('Kesalahan', err.message || 'Terjadi kesalahan');
  } finally {
    isProcessingRedeem[redemptionId] = false;
  }
};

// Queue Verifications
const processVerify = async (depositId: string, status: 'approved' | 'rejected') => {
  const count = verificationForms[depositId] || 1;
  if (count <= 0 && status === 'approved') {
    toast.warning('Input Tidak Valid', 'Jumlah popok riil harus lebih dari 0.');
    return;
  }

  const confirmMsg = status === 'approved' ? t('admin.acceptConfirm') : t('admin.rejectConfirm');
  const confirmed = await dialog.confirm(status === 'approved' ? 'Persetujuan Setoran' : 'Penolakan Setoran', confirmMsg);
  if (!confirmed) return;

  processingStates[depositId] = true;

  try {
    const { data: updatedDeposit, error } = await dbService.verifyDeposit(
      depositId,
      status,
      count,
      currentUser?.id || 'admin-uuid-1'
    );

    if (error) {
      toast.error('Verifikasi Gagal', error.message);
      return;
    }

    toast.success(
      status === 'approved' ? 'Persetujuan Sukses' : 'Penolakan Sukses',
      `Setoran telah berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}.`
    );

    if (status === 'approved' && updatedDeposit) {
      printMode.value = 'receipt';
      activeReceipt.value = {
        ...updatedDeposit,
        username: deposits.value.find(d => d.id === depositId)?.username || 'Pengguna'
      };
      isReceiptOpen.value = true;
    }

    await loadData();
  } catch (err: any) {
    toast.error('Gagal memproses', err.message || 'Error');
  } finally {
    processingStates[depositId] = false;
  }
};

// Offline deposit submission
const submitDirectOffline = async () => {
  if (!offlineForm.userId) {
    toast.warning('Warga Belum Dipilih', 'Silakan pilih warga kontributor terlebih dahulu.');
    return;
  }

  isSubmittingOffline.value = true;

  try {
    const { data: newDep, error } = await dbService.createDepositByAdmin(
      offlineForm.userId,
      offlineForm.diaperCount,
      offlineForm.notes || null,
      currentUser?.id || 'admin-uuid-1'
    );

    if (error) {
      toast.error('Gagal Menyimpan', error.message);
      return;
    }

    toast.success('Penyimpanan Sukses', t('admin.directEntry.success'));

    if (newDep) {
      const selectedUserObj = usersList.value.find(u => u.id === offlineForm.userId);
      printMode.value = 'receipt';
      activeReceipt.value = {
        ...newDep,
        username: selectedUserObj?.username || 'Pengguna'
      };
      isReceiptOpen.value = true;
    }

    offlineForm.userId = '';
    offlineForm.diaperCount = 10;
    offlineForm.notes = '';

    await loadData();
  } catch (err: any) {
    toast.error('Gagal memproses setoran', err.message || 'Error');
  } finally {
    isSubmittingOffline.value = false;
  }
};

// User Creation
const submitCreateUser = async () => {
  if (!newUserForm.username) {
    toast.warning('Data Belum Lengkap', 'Username wajib diisi.');
    return;
  }
  if (newUserForm.username.length < 3) {
    toast.warning('Username Pendek', 'Username minimal harus 3 karakter.');
    return;
  }
  if (/\s/.test(newUserForm.username)) {
    toast.warning('Username Salah', 'Username tidak boleh mengandung spasi.');
    return;
  }
  if (!newUserForm.password) {
    toast.warning('Data Belum Lengkap', 'Kata sandi wajib diisi.');
    return;
  }
  if (newUserForm.password.length < 6) {
    toast.warning('Kata Sandi Pendek', 'Kata sandi minimal harus 6 karakter.');
    return;
  }

  isCreatingUser.value = true;
  try {
    const { error } = await dbService.createAccountByAdmin(newUserForm.username, newUserForm.password);
    if (error) {
      toast.error('Gagal Registrasi', error.message);
      return;
    }

    toast.success('Registrasi Sukses', t('admin.userManagement.createSuccess'));
    isCreateUserOpen.value = false;
    newUserForm.username = '';
    newUserForm.password = 'password123';
    await loadData();
  } catch (err: any) {
    toast.error('Error', err.message || 'System error');
  } finally {
    isCreatingUser.value = false;
  }
};

// Password Reset
const resetPassword = async (userId: string) => {
  const confirmed = await dialog.confirm('Atur Ulang Sandi', 'Apakah Anda yakin ingin mengatur ulang kata sandi warga ini menjadi default (123456)?');
  if (!confirmed) return;
  
  const { error } = await dbService.resetUserPassword(userId, '123456');
  if (error) {
    toast.error('Gagal reset', error.message);
  } else {
    toast.success('Reset Berhasil', t('admin.userManagement.resetSuccess'));
  }
};

// Delete Account
const deleteAccount = async (userId: string) => {
  const confirmed = await dialog.confirm('Hapus Akun Warga', t('admin.userManagement.deleteConfirm'));
  if (!confirmed) return;

  const { error } = await dbService.deleteUser(userId);
  if (error) {
    toast.error('Gagal menghapus', error.message);
  } else {
    toast.success('Akun Dihapus', t('admin.userManagement.deleteSuccess'));
    await loadData();
  }
};

// Show User History List Modal
const showUserHistory = async (user: Profile) => {
  selectedUserForHistory.value = user;
  isHistoryOpen.value = true;
  const { data } = await dbService.getDeposits(user.id);
  if (data) {
    userHistoryList.value = data;
  }
};

const printExistingReceipt = (item: Deposit) => {
  printMode.value = 'receipt';
  activeReceipt.value = {
    ...item,
    username: selectedUserForHistory.value?.username || 'Pengguna'
  };
  isReceiptOpen.value = true;
};

// Save Parameters Configuration
const saveSystemSettings = async () => {
  const { error } = await dbService.updateSettings(
    sysSettings.value.diaper_rate,
    sysSettings.value.operational_schedule
  );

  if (error) {
    toast.error('Gagal menyimpan', error.message);
  } else {
    toast.success('Sukses Menyimpan', t('admin.settings.saveSettingsSuccess'));
  }
};

// Backup controls
const handleExportBackup = () => {
  const jsonStr = dbService.exportBackupData();
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `bapo_backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  toast.success('Backup Diunduh', 'Berkas backup database JSON berhasil diunduh.');
};

const handleImportBackup = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const { success, error } = dbService.importBackupData(text);
      if (success) {
        toast.success('Pemulihan Sukses', t('admin.settings.importSuccess'));
        await loadData();
      } else {
        toast.error('Gagal Pemulihan', error?.message || t('admin.settings.importError'));
      }
    };
    reader.readAsText(file);
  }
};

// Thermal Print Trigger Functions
const triggerReceiptPrint = () => {
  isReceiptOpen.value = false;
  printMode.value = 'receipt';
  setTimeout(() => {
    window.print();
  }, 150);
};

const triggerReportPrint = () => {
  printMode.value = 'report';
  setTimeout(() => {
    window.print();
  }, 150);
};

// ==========================================
// APEXCHARTS COMPUTATIONS
// ==========================================

const chartSeries = computed(() => {
  const approved = deposits.value.filter((d) => d.status === 'approved');
  const groupedData: Record<string, { count: number; rupiah: number }> = {};
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
    groupedData[date] = { count: 0, rupiah: 0 };
  }

  approved.forEach((d) => {
    const dateLabel = new Date(d.created_at).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
    if (groupedData[dateLabel] !== undefined) {
      groupedData[dateLabel].count += d.diaper_count;
      groupedData[dateLabel].rupiah += d.rupiah_earned;
    }
  });

  const categories = Object.keys(groupedData);
  const diaperCounts = categories.map((cat) => groupedData[cat].count);
  const rupiahPayouts = categories.map((cat) => groupedData[cat].rupiah);

  return [
    {
      name: t('admin.chartDiapers'),
      type: 'column',
      data: diaperCounts
    },
    {
      name: t('admin.chartPayout'),
      type: 'line',
      data: rupiahPayouts
    }
  ];
});

const chartOptions = computed(() => {
  const groupedData: Record<string, number> = {};
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
    groupedData[date] = 0;
  }
  const categories = Object.keys(groupedData);

  return {
    chart: {
      height: 325,
      type: 'line',
      toolbar: { show: false },
      zoom: {
        enabled: true,
        allowMouseWheelZoom: true
      },
      fontFamily: 'Outfit, Inter, sans-serif',
      background: 'transparent'
    },
    stroke: {
      width: [0, 4],
      curve: 'smooth'
    },
    colors: ['#10b981', '#f59e0b'],
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
      formatter: function (val: number) {
        return val > 0 ? 'Rp ' + new Intl.NumberFormat('id-ID').format(val) : '';
      },
      style: {
        fontSize: '10px',
        fontWeight: 'bold',
        colors: ['#64748b']
      }
    },
    labels: categories,
    xaxis: {
      type: 'category',
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: [
      {
        title: {
          text: t('admin.chartDiapers'),
          style: { color: '#10b981', fontWeight: 'bold' }
        },
        labels: {
          style: { colors: '#10b981' }
        }
      },
      {
        opposite: true,
        title: {
          text: t('admin.chartPayout'),
          style: { color: '#f59e0b', fontWeight: 'bold' }
        },
        labels: {
          style: { colors: '#f59e0b' },
          formatter: function (val: number) {
            return 'Rp' + new Intl.NumberFormat('id-ID').format(val);
          }
        }
      }
    ],
    grid: {
      borderColor: '#334155',
      strokeDashArray: 4
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    }
  };
});

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

const handleWheel = (event: WheelEvent) => {
  if (!event.ctrlKey) {
    event.stopPropagation();
  } else {
    event.preventDefault();
  }
};

onMounted(() => {
  loadData();
  console.log('Sandbox status:', isMocked.value);
});</script>

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none !important;
}
.no-scrollbar {
  -ms-overflow-style: none !important;
  scrollbar-width: none !important;
}

/* CSS Media Print Overrides for thermal printers and A4 reports */
@media print {
  body * {
    visibility: hidden;
    background: transparent !important;
  }
  
  .print-area-active, .print-area-active * {
    visibility: visible !important;
  }
  
  .print-area-active {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  #print-receipt.print-area-active {
    width: 76mm;
    padding: 10px;
    border: none !important;
  }

  #print-report.print-area-active {
    width: 100%;
    max-width: 100%;
    padding: 20px;
    border: none !important;
  }
  
  @page {
    margin: 1cm;
  }
  
  #print-receipt.print-area-active {
    margin: 0;
  }
  
  html, body {
    height: auto;
    overflow: visible;
  }
}
</style>
