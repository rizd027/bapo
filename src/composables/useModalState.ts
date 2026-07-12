// src/composables/useModalState.ts
// Tracks how many modals are currently open across the app
import { ref, computed } from 'vue';

const openModalCount = ref(0);

export function useModalState() {
  const isAnyModalOpen = computed(() => openModalCount.value > 0);

  const registerModalOpen = () => {
    openModalCount.value++;
  };

  const registerModalClose = () => {
    if (openModalCount.value > 0) {
      openModalCount.value--;
    }
  };

  return { isAnyModalOpen, registerModalOpen, registerModalClose };
}
