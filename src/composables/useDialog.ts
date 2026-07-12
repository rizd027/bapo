// src/composables/useDialog.ts
import { ref } from 'vue';

interface DialogOptions {
  title: string;
  message: string;
  type: 'confirm' | 'alert';
  resolve: (value: boolean) => void;
}

const activeDialog = ref<DialogOptions | null>(null);

export function useDialog() {
  const confirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      activeDialog.value = {
        title,
        message,
        type: 'confirm',
        resolve
      };
    });
  };

  const alert = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      activeDialog.value = {
        title,
        message,
        type: 'alert',
        resolve
      };
    });
  };

  const closeDialog = (result: boolean) => {
    if (activeDialog.value) {
      activeDialog.value.resolve(result);
      activeDialog.value = null;
    }
  };

  return {
    activeDialog,
    confirm,
    alert,
    closeDialog
  };
}
