<!-- src/components/UI/Dropdown.vue -->
<template>
  <div ref="dropdownRef" class="relative inline-block text-left">
    <!-- Dropdown Button Trigger -->
    <div @click="toggleDropdown" class="cursor-pointer">
      <slot name="trigger"></slot>
    </div>

    <!-- Dropdown Panel -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        ref="panelRef"
        :class="[
          'absolute z-50 min-w-[12rem] bg-slate-100 dark:bg-slate-800 rounded-xl py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200',
          positionClass,
          alignClass
        ]"
      >
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';

const props = defineProps({
  // Alignment: 'left' or 'right'
  align: {
    type: String,
    default: 'right'
  }
});

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const placement = ref<'bottom' | 'top'>('bottom');

const toggleDropdown = () => {
  if (isOpen.value) {
    isOpen.value = false;
  } else {
    isOpen.value = true;
    nextTick(() => {
      calculatePosition();
    });
  }
};

const calculatePosition = () => {
  if (!dropdownRef.value || !panelRef.value) return;

  const triggerRect = dropdownRef.value.getBoundingClientRect();
  const panelHeight = panelRef.value.offsetHeight;
  const viewportHeight = window.innerHeight;

  // Cek sisa ruang di bagian bawah dan atas trigger
  const spaceBelow = viewportHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;

  // Jika tombol mendekati footer (ruang bawah lebih kecil dari tinggi panel),
  // dan ruang di atas lebih besar, maka buka ke atas.
  if (spaceBelow < panelHeight && spaceAbove > panelHeight) {
    placement.value = 'top';
  } else {
    placement.value = 'bottom';
  }
};

const positionClass = computed(() => {
  return placement.value === 'top' 
    ? 'bottom-full mb-2 origin-bottom' 
    : 'top-full mt-2 origin-top';
});

const alignClass = computed(() => {
  return props.align === 'left' ? 'left-0' : 'right-0';
});

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

// Re-calculate position on window scroll or resize
const handleScrollOrResize = () => {
  if (isOpen.value) {
    calculatePosition();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', handleScrollOrResize, true);
  window.addEventListener('resize', handleScrollOrResize);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', handleScrollOrResize, true);
  window.removeEventListener('resize', handleScrollOrResize);
});
</script>
