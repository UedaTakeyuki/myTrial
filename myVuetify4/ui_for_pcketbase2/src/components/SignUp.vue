<template>
  <!-- 外側の v-card や v-show を削除し、ダイアログの内包コンテンツとして最適化 -->
  <div class="w-100">
    
    <!-- 一般的なエラー（システムエラーなど）の表示 -->
    <v-alert
      v-if="serversideErrors.message"
      type="error"
      variant="tonal"
      class="mb-6 rounded-lg"
      density="comfortable"
    >
      {{ serversideErrors.message }}
    </v-alert>

    <!-- 1. 入力フィールド：variantをsolo-filledにし、高さを抑えてスタイリッシュに -->
    <v-text-field
      v-model="name"
      label="Name"
      placeholder="Jane Doe"
      variant="solo-filled"
      flat
      density="comfortable"
      prepend-inner-icon="mdi-account-outline"
      class="mb-2"
    />

    <v-text-field
      v-model="email"
      label="Email address"
      placeholder="johndoe@gmail.com"
      type="email"
      variant="solo-filled"
      flat
      density="comfortable"
      prepend-inner-icon="mdi-email-outline"
      :error-messages="serversideErrors.data?.email?.message"
      class="mb-2"
    />

    <!-- PwInput側にも型崩れ防止のため variant="solo-filled" flat density="comfortable" を渡すとさらに綺麗になります -->
    <PwInput 
      v-model="pw"
      variant="solo-filled"
      flat
      density="comfortable"
      :rules="passwordRules"
      :error-messages="serversideErrors.data?.password?.message"
      class="mb-2"
    />

    <PwInput 
      v-model="pw2"
      label="Password Confirm"
      hint="Confirm password"
      variant="solo-filled"
      flat
      density="comfortable"
      :rules="[matchRule]"
      :error-messages="serversideErrors.data?.passwordConfirm?.message"
      class="mb-6"
    />

    <!-- 2. ボタン配置：メインボタンを大きく下部に配置し、切り替えは下に控えめに配置 -->
    <v-btn
      color="primary"
      block
      flat
      height="48"
      class="rounded-xl font-weight-bold text-none mb-4"
      :loading="loading"
      :disabled="loading"
      @click="signUpUser"
    >
      Create Account
    </v-btn>

    <div class="text-center">
      <span class="text-body-2 text-medium-emphasis">Already have an account? </span>
      <v-btn 
        variant="text" 
        color="primary" 
        class="text-none font-weight-bold px-1" 
        density="comfortable"
        @click="showIn = true"
      >
        Sign In
      </v-btn>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import PocketBase from 'pocketbase'
  import PwInput from '@/components/PwInput.vue'

  const emit = defineEmits(['success'])
  const pb = new PocketBase('https://pocketbase.uedasoft.com');

  const email = ref('')
  const pw = ref('')
  const pw2 = ref('')
  const name = ref('')
  const serversideErrors = ref({})
  const loading = ref(false)

  // 親から渡された表示切り替えフラグを受け取る
  const showIn = defineModel({ type: Boolean, default: false })

  const signUpUser = async () => {
    if (loading.value) return

    loading.value = true
    serversideErrors.value = {}

    const data = {
      "email": email.value,
      "password": pw.value,
      "passwordConfirm": pw2.value,
      "name": name.value
    };

    try {
      const record = await pb.collection('users').create(data);
      console.log('Successfully registered:', record.id);

      const authData = await pb.collection("users").authWithPassword(email.value, pw.value);
      emit('success', authData);
    } catch (err) {
      console.error('Registration failed:', err);
      if (err.response && err.response.data) {
        serversideErrors.value = err.response;
      } else {
        serversideErrors.value = { message: err.message || '予期せぬエラーが発生しました。', data: {} };
      }
    } finally {
      loading.value = false
    }
  }

  const passwordRules = [
    v => !!v || 'Cannot be blank.',
    v => (v && v.length >= 8) || 'Must be at least 8 character(s).',
  ]

  const matchRule = (value) => (value == pw.value) || 'password not match.'
</script>