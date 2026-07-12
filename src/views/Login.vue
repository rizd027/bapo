<!-- src/views/Login.vue -->
<template>
  <div class="max-w-md mx-auto my-12 flex flex-col gap-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 font-sans">
        {{ t('auth.loginTitle') }}
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
        {{ t('auth.loginSubtitle') }}
      </p>
    </div>

    <!-- Alert Message -->
    <Alert v-if="errorMessage" type="error" dismissible @close="errorMessage = ''">
      {{ errorMessage }}
    </Alert>

    <!-- Cardless Form -->
    <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
      <!-- Username input -->
      <div>
        <label for="username" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
          {{ t('common.username') }}
        </label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 border border-transparent transition-all"
          :placeholder="t('common.username')"
          required
        />
        <p v-if="validationErrors.username" class="text-xs text-red-500 mt-1.5 font-medium">
          {{ validationErrors.username }}
        </p>
      </div>

      <!-- Password input -->
      <div>
        <label for="password" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
          {{ t('common.password') }}
        </label>
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 border border-transparent transition-all"
            :placeholder="t('common.password')"
            required
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
            title="Tampilkan / Sembunyikan Kata Sandi"
          >
            <EyeIcon v-if="!showPassword" class="h-5 w-5" />
            <EyeOffIcon v-else class="h-5 w-5" />
          </button>
        </div>
        <p v-if="validationErrors.password" class="text-xs text-red-500 mt-1.5 font-medium">
          {{ validationErrors.password }}
        </p>
      </div>

      <!-- Login Button -->
      <Button
        type="submit"
        variant="primary"
        size="lg"
        :loading="isLoading"
        full-width
        class="mt-2"
      >
        {{ t('auth.loginButton') }}
      </Button>

      <!-- Help Tautan (Lupa Kata Sandi WhatsApp) -->
      <div class="text-center mt-2">
        <a
          :href="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-medium text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
        >
          {{ t('auth.forgotPassword') }}
        </a>
      </div>
    </form>

    <!-- Navigasi Daftar -->
    <div class="text-center border-t border-slate-100 dark:border-slate-800 pt-6">
      <router-link
        to="/register"
        class="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
      >
        {{ t('auth.noAccount') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { z } from 'zod';
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-vue-next';
import Alert from '../components/UI/Alert.vue';
import Button from '../components/UI/Button.vue';
import { dbService } from '../services/supabase';
import { useToast } from '../composables/useToast';

const { t } = useI18n();
const router = useRouter();
const toast = useToast();

const form = reactive({
  username: '',
  password: ''
});

const isLoading = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');
const validationErrors = reactive<Record<string, string>>({
  username: '',
  password: ''
});

// Zod Schema untuk Validasi Username & Password client-side
const loginSchema = z.object({
  username: z.string()
    .min(3, t('auth.validation.usernameMin'))
    .refine((val) => !/\s/.test(val), t('auth.validation.usernameSpaces')),
  password: z.string()
    .min(6, t('auth.validation.passwordMin'))
});

const whatsappUrl = computed(() => {
  const usernameEncoded = encodeURIComponent(form.username || '...');
  return `https://wa.me/628533745892?text=Halo%20Admin%20BAPO,%20saya%20lupa%20kata%20sandi%20untuk%20username%20${usernameEncoded}`;
});

const handleLogin = async () => {
  errorMessage.value = '';
  validationErrors.username = '';
  validationErrors.password = '';

  // Validasi Form via Zod
  const result = loginSchema.safeParse(form);
  if (!result.success) {
    result.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      validationErrors[field] = err.message;
    });
    return;
  }

  isLoading.value = true;

  try {
    const { user, error } = await dbService.signIn(form.username, form.password);
    
    if (error) {
      errorMessage.value = error.message;
      toast.error('Masuk Gagal', error.message);
      return;
    }

    if (user) {
      toast.success('Selamat Datang!', `${t('dashboard.welcome')} ${user.username}`);
      
      // Ambil profil untuk menentukan pengalihan dashboard
      const { data: profile } = await dbService.getProfile(user.id);
      if (profile?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  } catch (err: any) {
    errorMessage.value = 'Terjadi kesalahan sistem.';
    toast.error('Gagal Masuk', err.message || 'Error');
  } finally {
    isLoading.value = false;
  }
};
</script>
