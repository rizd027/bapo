<!-- src/views/Register.vue -->
<template>
  <div class="max-w-md mx-auto my-12 flex flex-col gap-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 font-sans">
        {{ t('auth.registerTitle') }}
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
        {{ t('auth.registerSubtitle') }}
      </p>
    </div>

    <!-- Alert Message -->
    <Alert v-if="errorMessage" type="error" dismissible @close="errorMessage = ''">
      {{ errorMessage }}
    </Alert>

    <!-- Cardless Form -->
    <form @submit.prevent="handleRegister" class="flex flex-col gap-5">
      <!-- Username input -->
      <div>
        <label for="reg-username" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
          {{ t('common.username') }}
        </label>
        <input
          id="reg-username"
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
        <label for="reg-password" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
          {{ t('common.password') }}
        </label>
        <div class="relative">
          <input
            id="reg-password"
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

      <!-- Confirm Password input -->
      <div>
        <label for="reg-confirm-password" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
          {{ t('common.confirmPassword') }}
        </label>
        <div class="relative">
          <input
            id="reg-confirm-password"
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 border border-transparent transition-all"
            :placeholder="t('common.confirmPassword')"
            required
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
            title="Tampilkan / Sembunyikan Kata Sandi"
          >
            <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5" />
            <EyeOffIcon v-else class="h-5 w-5" />
          </button>
        </div>
        <p v-if="validationErrors.confirmPassword" class="text-xs text-red-500 mt-1.5 font-medium">
          {{ validationErrors.confirmPassword }}
        </p>
      </div>

      <!-- Register Button -->
      <Button
        type="submit"
        variant="primary"
        size="lg"
        :loading="isLoading"
        full-width
        class="mt-2"
      >
        {{ t('auth.registerButton') }}
      </Button>
    </form>

    <!-- Navigasi Login -->
    <div class="text-center border-t border-slate-100 dark:border-slate-800 pt-6">
      <router-link
        to="/login"
        class="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
      >
        {{ t('auth.haveAccount') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
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
  password: '',
  confirmPassword: ''
});

const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref('');
const validationErrors = reactive<Record<string, string>>({
  username: '',
  password: '',
  confirmPassword: ''
});

// Zod Schema untuk Pendaftaran Akun
const registerSchema = z.object({
  username: z.string()
    .min(3, t('auth.validation.usernameMin'))
    .refine((val) => !/\s/.test(val), t('auth.validation.usernameSpaces')),
  password: z.string()
    .min(6, t('auth.validation.passwordMin')),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: t('auth.validation.passwordsMatch'),
  path: ['confirmPassword']
});

const handleRegister = async () => {
  errorMessage.value = '';
  validationErrors.username = '';
  validationErrors.password = '';
  validationErrors.confirmPassword = '';

  // Validasi Form via Zod
  const result = registerSchema.safeParse(form);
  if (!result.success) {
    result.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      validationErrors[field] = err.message;
    });
    return;
  }

  isLoading.value = true;

  try {
    const { user, error } = await dbService.signUp(form.username, form.password);
    
    if (error) {
      errorMessage.value = error.message;
      toast.error('Registrasi Gagal', error.message);
      return;
    }

    if (user) {
      toast.success('Pendaftaran Berhasil', 'Akun kontributor Anda telah terdaftar.');
      router.push('/dashboard');
    }
  } catch (err: any) {
    errorMessage.value = 'Terjadi kesalahan sistem.';
    toast.error('Gagal Registrasi', err.message || 'Error');
  } finally {
    isLoading.value = false;
  }
};
</script>
