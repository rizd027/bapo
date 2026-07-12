<!-- src/components/UI/Toast.vue -->
<template>
  <div class="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3.5 w-full max-w-sm pointer-events-none">
    <transition-group
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto w-full overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-2xl p-4 flex flex-col gap-2.5 border transition-all relative',
          toastBorderClass(toast.type)
        ]"
      >
        <div class="flex items-start gap-3">
          <!-- Icon Selector (Flat pure SVG) -->
          <div class="flex-shrink-0">
            <!-- Success (Green) -->
            <svg v-if="toast.type === 'success'" class="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Error (Red) -->
            <svg v-else-if="toast.type === 'error'" class="h-5 w-5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <!-- Warning (Yellow) -->
            <svg v-else-if="toast.type === 'warning'" class="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <!-- Info (Blue) -->
            <svg v-else class="h-5 w-5 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083.984l-.04.02a.75.75 0 01-1.083-.984zM12 9a.75.75 0 110-1.5.75.75 0 010 1.5zm0 11.25a9 9 0 110-18 9 9 0 010 18z" />
            </svg>
          </div>

          <!-- Toast Text Content -->
          <div class="flex-1 pt-0.5 min-w-0">
            <p class="text-xs font-black text-slate-800 dark:text-slate-100">
              {{ toast.title }}
            </p>
            <p v-if="toast.message" class="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close Button -->
          <div class="flex-shrink-0 flex">
            <button
              @click="removeToast(toast.id)"
              class="inline-flex rounded-lg text-slate-400 hover:text-slate-500 focus:outline-none hover:bg-slate-100 dark:hover:bg-slate-800 p-0.5 transition-colors"
            >
              <span class="sr-only">Close</span>
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Animated Progress Bar at bottom -->
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-slate-100/40 dark:bg-slate-800/20">
          <div
            :class="[
              'h-full ease-linear transition-all',
              toastProgressBgClass(toast.type)
            ]"
            :style="{
              width: '100%',
              animation: `toast-progress-bar ${toast.duration ?? 4000}ms linear forwards`
            }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../../composables/useToast';

const { toasts, removeToast } = useToast();

const toastBorderClass = (type: string) => {
  switch (type) {
    case 'success': return 'border-emerald-500/20 dark:border-emerald-500/30';
    case 'error': return 'border-rose-500/20 dark:border-rose-500/30';
    case 'warning': return 'border-amber-500/20 dark:border-amber-500/30';
    case 'info':
    default:
      return 'border-sky-500/20 dark:border-sky-500/30';
  }
};

const toastProgressBgClass = (type: string) => {
  switch (type) {
    case 'success': return 'bg-emerald-500 dark:bg-emerald-400';
    case 'error': return 'bg-rose-500 dark:bg-rose-400';
    case 'warning': return 'bg-amber-500 dark:bg-amber-400';
    case 'info':
    default:
      return 'bg-sky-500 dark:bg-sky-400';
  }
};
</script>

<style scoped>
@keyframes toast-progress-bar {
  from { width: 100%; }
  to { width: 0%; }
}
</style>
