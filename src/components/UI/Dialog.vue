<!-- src/components/UI/Dialog.vue -->
<template>
  <teleport to="body">
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-200 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="activeDialog" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm">
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            class="w-full max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col gap-4 shadow-2xl transition-all"
          >
            <!-- Title -->
            <div class="flex items-center gap-3">
              <div :class="['p-2 rounded-xl flex-shrink-0', iconBgClass]">
                <svg v-if="dialogVariant === 'danger'" class="h-5 w-5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <svg v-else-if="dialogVariant === 'success'" class="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 class="text-base font-black text-slate-900 dark:text-slate-50 leading-snug">
                {{ activeDialog?.title }}
              </h3>
            </div>

            <!-- Message Body -->
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed pl-1">
              {{ activeDialog?.message }}
            </p>

            <!-- Buttons -->
            <div class="flex justify-end gap-2.5 pt-2">
              <button
                v-if="activeDialog?.type === 'confirm'"
                @click="closeDialog(false)"
                class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                @click="closeDialog(true)"
                class="px-4 py-2 text-xs font-bold bg-forest-leaf hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-500/10 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDialog } from '../../composables/useDialog';

const { activeDialog, closeDialog } = useDialog();

const dialogVariant = computed(() => {
  const title = (activeDialog.value?.title || '').toLowerCase();
  if (title.includes('hapus') || title.includes('tolak') || title.includes('danger') || title.includes('gagal')) {
    return 'danger';
  }
  if (title.includes('sukses') || title.includes('berhasil') || title.includes('konfirmasi')) {
    return 'success';
  }
  return 'warning';
});

const iconBgClass = computed(() => {
  switch (dialogVariant.value) {
    case 'danger': return 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-500';
    case 'success': return 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500';
    case 'warning':
    default:
      return 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-500';
  }
});
</script>
