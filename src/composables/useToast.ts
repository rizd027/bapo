// src/composables/useToast.ts
import { ref } from 'vue';

export interface ToastMessage {
  id: number;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const toasts = ref<ToastMessage[]>([]);
let counter = 0;

export function useToast() {
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = counter++;
    const duration = toast.duration ?? 4000;
    
    const newToast: ToastMessage = {
      ...toast,
      id
    };

    toasts.value.push(newToast);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  const success = (title: string, message?: string) => {
    addToast({ title, message, type: 'success' });
  };

  const error = (title: string, message?: string) => {
    addToast({ title, message, type: 'error' });
  };

  const warning = (title: string, message?: string) => {
    addToast({ title, message, type: 'warning' });
  };

  const info = (title: string, message?: string) => {
    addToast({ title, message, type: 'info' });
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
}
