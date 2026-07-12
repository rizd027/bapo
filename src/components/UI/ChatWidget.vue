<!-- src/components/UI/ChatWidget.vue -->
<template>
  <div class="fixed bottom-6 right-6 z-[999] no-print">
    <!-- FAB Icon Button (Flat styled circle, rounded-lg) -->
    <button
      @click="toggleChat"
      class="w-14 h-14 bg-forest-leaf hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center shadow-lg active:scale-95 transition-transform focus:outline-none"
      title="Tanya Admin"
    >
      <svg v-if="!isOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <svg v-if="isOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Chat Dialog Popover overlay (No animation, instant render) -->
    <div
      v-if="isOpen"
      class="absolute bottom-20 right-0 w-[350px] sm:w-[380px] h-[480px] bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden"
    >
      <!-- Header -->
      <div class="px-4 py-3 bg-forest-leaf text-white flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
          <div>
            <h3 class="text-xs font-bold tracking-wide">Tanya Jawab Warga</h3>
            <p class="text-[9px] text-white/80 font-medium">Balasan admin cepat & aktif</p>
          </div>
        </div>
        <button @click="isOpen = false" class="text-white/80 hover:text-white transition-colors text-xs font-bold p-1 hover:bg-white/10 rounded">
          ✕
        </button>
      </div>

      <!-- Message logs area -->
      <div ref="msgBoxRef" class="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50 dark:bg-slate-950/20 scrollbar-thin">
        <div v-if="messages.length === 0" class="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 space-y-2 py-10">
          <svg class="h-8 w-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <div class="text-center px-4">
            <p class="text-xs font-bold text-slate-400">Belum ada percakapan</p>
            <p class="text-[10px] text-slate-400/80 mt-0.5">Tanyakan apa saja seputar pengumpulan popok, tarif, atau penukaran poin!</p>
          </div>
        </div>

        <div
          v-else
          v-for="msg in messages"
          :key="msg.id"
          :class="['flex flex-col max-w-[80%] min-w-0', msg.sender_id === currentUser?.id ? 'ml-auto items-end' : 'mr-auto items-start']"
        >
          <span
            class="text-[9px] font-bold mb-0.5 px-0.5"
            :class="isAdminSender(msg) ? 'text-forest-leaf dark:text-forest-accent font-black' : 'text-slate-400 dark:text-slate-500'"
          >
            {{ msg.sender_id === currentUser?.id ? 'Anda' : '@' + msg.sender_username }}
          </span>

          <!-- Image attachment rendering -->
          <template v-if="msg.message.startsWith('data:image/')">
            <img
              :src="msg.message"
              class="max-w-[180px] rounded-lg shadow-sm cursor-pointer border border-slate-200 dark:border-slate-800"
              alt="Lampiran gambar"
              @click="previewImgUrl = msg.message"
            />
          </template>

          <!-- PDF or other file attachment rendering -->
          <div
            v-else
            :class="[
              'px-3 py-2 rounded-lg text-xs font-medium leading-relaxed shadow-sm break-words whitespace-pre-wrap w-full',
              msg.sender_id === currentUser?.id
                ? 'bg-forest-leaf text-white rounded-tr-sm'
                : 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-tl-sm border border-slate-200 dark:border-slate-800'
            ]"
          >
            <template v-if="msg.message.startsWith('📎')">
              <div class="flex items-center gap-1.5 min-w-0">
                <svg class="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span class="truncate flex-1 text-[11px] font-bold underline cursor-pointer" @click="downloadFileAttachment(msg.message)">
                  {{ msg.message.replace('📎 ', '') }}
                </span>
              </div>
            </template>
            <template v-else>
              {{ msg.message }}
            </template>
          </div>
          <span class="text-[8px] text-slate-400 mt-0.5 px-1">{{ formatDateShort(msg.created_at) }}</span>
        </div>
      </div>

      <!-- Attachment Preview Banner -->
      <div v-if="attachmentName" class="flex items-center gap-2 py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950/20 text-xs font-bold text-emerald-700 dark:text-emerald-400 border-t border-slate-200 dark:border-slate-800">
        <!-- Thumbnail preview for images -->
        <img v-if="attachmentIsImage && attachmentDataUrl" :src="attachmentDataUrl" class="h-8 w-8 rounded object-cover flex-shrink-0 shadow-sm border border-emerald-300" alt="Preview" />
        <svg v-else class="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        <span class="truncate flex-1 text-[10px]">{{ attachmentName }}</span>
        <button type="button" @click="clearAttachment" class="text-rose-500 hover:text-rose-700 font-bold ml-auto">✕</button>
      </div>

      <!-- Input Box -->
      <div class="p-3 border-t border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
        <!-- Send Files Attachment Button -->
        <label class="cursor-pointer flex-shrink-0 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" title="Lampirkan File">
          <input
            ref="fileInputRef"
            type="file"
            class="hidden"
            @change="handleAttachment"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          />
          <svg class="h-4 w-4 text-slate-400 hover:text-forest-leaf transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </label>

        <input
          v-model="newMsgText"
          @keydown.enter="sendMsg"
          type="text"
          class="flex-1 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 focus:outline-none border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2"
          placeholder="Tulis pesan Anda..."
          :disabled="isSending"
        />
        <button
          type="button"
          @click="sendMsg"
          :disabled="isSending || (!newMsgText.trim() && !attachmentDataUrl)"
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-forest-leaf text-white disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 flex-shrink-0"
        >
          <svg class="h-3.5 w-3.5 transform rotate-45 -translate-x-0.5 translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 9.74A2 2 0 014.28 6.43l13.137-3.957a2 2 0 012.56 2.56L16.02 18.17a2 2 0 01-3.313.25L9.5 15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Image Lightbox Overlay Preview -->
    <teleport to="body">
      <div v-if="previewImgUrl" @click="previewImgUrl = null" class="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <img :src="previewImgUrl" class="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl border border-white/10" alt="Full Preview" />
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from 'vue';
import { dbService, type ChatMessage } from '../../services/supabase';
import { useChatWidget } from '../../composables/useChatWidget';
import { useToast } from '../../composables/useToast';

const toast = useToast();
const { isChatOpen: isOpen } = useChatWidget();
const newMsgText = ref('');
const isSending = ref(false);
const messages = ref<ChatMessage[]>([]);
const isAdminSender = (msg: any) => {
  return msg.sender_id.startsWith('admin-') || ['admin_bapo', 'greenetix_admin', 'rohman'].includes(msg.sender_username);
};
const msgBoxRef = ref<HTMLElement | null>(null);

// Attachment states
const fileInputRef = ref<HTMLInputElement | null>(null);
const attachmentName = ref('');
const attachmentDataUrl = ref<string | null>(null);
const attachmentIsImage = ref(false);

const previewImgUrl = ref<string | null>(null);

const currentUser = dbService.getCurrentUser();

let intervalId: any = null;

const loadMessages = () => {
  if (!currentUser) return;
  messages.value = dbService.getChatMessages(currentUser.id);
  scrollToBottom();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (msgBoxRef.value) {
      msgBoxRef.value.scrollTop = msgBoxRef.value.scrollHeight;
    }
  });
};

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

// File handlers
const handleAttachment = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    attachmentName.value = file.name;
    attachmentIsImage.value = file.type.startsWith('image/');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      attachmentDataUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    if (!newMsgText.value.trim() && !attachmentIsImage.value) {
      newMsgText.value = `📎 ${file.name}`;
    }
    toast.success('File Dipilih', `"${file.name}" siap dikirim.`);
  }
};

const clearAttachment = () => {
  attachmentName.value = '';
  attachmentDataUrl.value = null;
  attachmentIsImage.value = false;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const sendMsg = async () => {
  if (!currentUser || isSending.value) return;
  
  const msgToSend = attachmentIsImage.value && attachmentDataUrl.value
    ? attachmentDataUrl.value
    : newMsgText.value.trim();

  if (!msgToSend) return;

  isSending.value = true;
  try {
    const { error } = await dbService.sendChatMessage(
      currentUser.id,
      currentUser.id,
      currentUser.username,
      msgToSend
    );
    if (!error) {
      newMsgText.value = '';
      clearAttachment();
      loadMessages();
    }
  } finally {
    isSending.value = false;
  }
};

const downloadFileAttachment = (msg: string) => {
  const fileName = msg.replace('📎 ', '');
  toast.info('Unduh File', `Mengunduh file: ${fileName}`);
  // Simulated download trigger
  const link = document.createElement('a');
  link.href = '#';
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const formatDateShort = (isoString: string) => {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + d.toLocaleDateString([], { day: 'numeric', month: 'short' });
};

watch(isOpen, (newVal) => {
  if (newVal) {
    loadMessages();
    intervalId = setInterval(loadMessages, 4000);
  } else {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
});

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>
