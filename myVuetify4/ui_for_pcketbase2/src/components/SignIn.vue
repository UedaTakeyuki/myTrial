<template>
  <div class="w-100">
    
    <!-- 一般的なエラー（パスワード間違いなど）の表示 -->
    <v-alert
      v-if="serversideErrors.message"
      type="error"
      variant="tonal"
      class="mb-6 rounded-lg"
      density="comfortable"
    >
      {{ serversideErrors.message }}
    </v-alert>

    <!-- 【復活】1. メールアドレス入力欄 -->
    <v-text-field
      class="mx-1 mb-2"
      v-model="email"
      label="Email address"
      variant="solo-filled"
      flat
      density="comfortable"
      placeholder="johndoe@gmail.com"
      type="email"
      prepend-inner-icon="mdi-email-outline"
    />

    <!-- 2. パスワード入力欄 -->
    <PwInput 
      v-model="pw"
      label="Password"
      variant="solo-filled"
      flat
      density="comfortable"
      :error-messages="serversideErrors.data?.password?.message"
      class="mb-6"
    />

    <!-- 3. ログインボタン -->
    <v-btn
      color="primary"
      block
      flat
      height="48"
      class="rounded-xl font-weight-bold text-none mb-4"
      :loading="loading"
      :disabled="loading"
      @click="signInUser"
    >
      Sign In
    </v-btn>

    <!-- 4. アカウント作成画面への切り替えリンク -->
    <div class="text-center">
      <span class="text-body-2 text-medium-emphasis">Don't have an account? </span>
      <v-btn 
        variant="text" 
        color="primary" 
        class="text-none font-weight-bold px-1" 
        density="comfortable"
        @click="showIn = false"
      >
        Sign Up
      </v-btn>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import PocketBase from 'pocketbase'
  import PwInput from '@/components/PwInput.vue'

  const emit = defineEmits(['success'])
  const pb = new PocketBase('https://uedasoft.com');

  const email = ref('')
  const pw = ref('')
  const serversideErrors = ref({})
  const loading = ref(false)

  // 親から渡された表示切り替えフラグ
  const showIn = defineModel({ type: Boolean, default: true })

  // Sign In 処理
  const signInUser = async () => {
    if (loading.value) return

    loading.value = true
    serversideErrors.value = {}

    try {
      // PocketBaseでのログイン処理（email または username で認証）
      const authData = await pb.collection("users").authWithPassword(email.value, pw.value);
      console.log('Successfully signed in:', authData.record.id);

      emit('success', authData);
    } catch (err) {
      console.error('Sign in failed:', err);
      if (err.response && err.response.data) {
        serversideErrors.value = err.response;
      } else {
        serversideErrors.value = { message: err.message || 'メールアドレスまたはパスワードが正しくありません。', data: {} };
      }
    } finally {
      loading.value = false
    }
  }
</script>