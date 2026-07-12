<!-- src/components/UI/Alert.vue -->
<template>
  <div
    v-if="visible"
    :class="[
      'p-4 rounded-2xl flex items-start gap-3 transition-all duration-300',
      themeClasses
    ]"
  >
    <!-- Icon Container -->
    <div class="flex-shrink-0">
      <!-- Success Icon -->
      <svg v-if="type === 'success'" class="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <!-- Info Icon -->
      <svg v-else-if="type === 'info'" class="h-5 w-5 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083.984l-.04.02a.75.75 0 01-1.083-.984zM12 9a.75.75 0 110-1.5.75.75 0 010 1.5zm0 11.25a9 9 0 110-18 9 9 0 010 18z" />
      </svg>
      <!-- Warning Icon -->
      <svg v-else-if="type === 'warning'" class="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <!-- Error / Danger Icon -->
      <svg v-else-if="type === 'error'" class="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    </div>

    <!-- Content Slot -->
    <div class="flex-1 text-sm">
      <h3 v-if="title" class="font-semibold mb-1 text-slate-900 dark:text-slate-50">
        {{ title }}
      </h3>
      <div class="text-slate-700 dark:text-slate-300">
        <slot></slot>
      </div>
    </div>

    <!-- Dismiss Button -->
    <div v-if="dismissible" class="flex-shrink-0 flex">
      <button
        @click="dismiss"
        class="inline-flex rounded-md p-1 focus:outline-none hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-5"
      >
        <span class="sr-only">Dismiss</span>
        <svg class="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value: string) => ['success', 'info', 'warning', 'error'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);
const visible = ref(true);

const dismiss = () => {
  visible.value = false;
  emit('close');
};

const themeClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300';
    case 'warning':
      return 'bg-amber-50/70 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300';
    case 'error':
      return 'bg-red-50/70 dark:bg-red-950/20 text-red-800 dark:text-red-300';
    case 'info':
    default:
      return 'bg-sky-50/70 dark:bg-sky-950/20 text-sky-800 dark:text-sky-300';
  }
});
</script>
