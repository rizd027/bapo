<!-- src/components/UI/Modal.vue -->
<template>
  <teleport to="body">
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-200 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <!-- Overlay: on mobile align to bottom (bottom-sheet), on sm+ center -->
      <div
        v-if="show"
        @click.self="closeOnOverlay && close()"
        class="fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-sm
               items-end justify-center
               sm:items-center sm:p-4"
      >
        <!-- Modal Wrapper -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
          leave-to-class="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="show"
            ref="modalBoxRef"
            :class="[
              'w-full bg-slate-50 dark:bg-slate-900 shadow-2xl transform transition-all flex flex-col gap-5',
              'max-h-[90dvh] overflow-y-auto',
              // Mobile: fullscreen bottom-sheet (rounded top corners only)
              'rounded-t-3xl p-6',
              // sm+: centered card with max-width and full rounded corners
              'sm:rounded-2xl',
              sizeClass
            ]"
          >
            <!-- Drag Handle (visible on mobile only) -->
            <div class="sm:hidden flex justify-center -mt-2 mb-1">
              <div class="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
            </div>

            <!-- Header -->
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-50">
                <slot name="header"></slot>
              </h3>
              <button
                @click="close"
                class="rounded-full p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <span class="sr-only">Close modal</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 text-sm text-slate-600 dark:text-slate-400">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <slot name="footer"></slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (val: string) => ['sm', 'md', 'lg', 'xl'].includes(val)
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close']);
const modalBoxRef = ref<HTMLElement | null>(null);

const close = () => {
  emit('close');
};

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'sm:max-w-sm';
    case 'lg': return 'sm:max-w-2xl';
    case 'xl': return 'sm:max-w-4xl';
    case 'md':
    default:
      return 'sm:max-w-lg';
  }
});

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    close();
  }
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});
</script>
