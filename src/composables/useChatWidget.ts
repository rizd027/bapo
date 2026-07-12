// src/composables/useChatWidget.ts
import { ref } from 'vue';

const isChatOpen = ref(false);

export function useChatWidget() {
  return { isChatOpen };
}
