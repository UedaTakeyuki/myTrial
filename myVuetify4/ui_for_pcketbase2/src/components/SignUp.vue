<template>
  <v-card
    v-show="!showIn"
    title="Sign Up"
    width="331"
  >
    <v-card-item>
      <!-- 一般的なエラー（システムエラーなど）の表示 -->
      <v-alert
        v-if="serversideErrors.message"
        type="error"
        variant="tonal"
        class="mb-4"
        density="compact"
      >
        {{ serversideErrors.message }}
      </v-alert>

      <v-text-field
        v-model="name"
        label="Name"
        placeholder="Jane Doe"
      />

      <v-text-field
        v-model="email"
        label="Email address"
        placeholder="johndoe@gmail.com"
        type="email"
        :error-messages="serversideErrors.data?.email?.message"
      />

      <PwInput 
        v-model="pw"
        :rules=passwordRules
        :error-messages="serversideErrors.data?.password?.message"
      />

      <PwInput 
        v-model="pw2"
        label="Password Confirm"
        hint="Confirm password"
        :rules="[matchRule]"
        :error-messages="serversideErrors.data?.passwordConfirm?.message"
      />
    </v-card-item>

    <v-card-actions>
      <v-btn @click="showIn = !showIn">Sign In</v-btn>

      <v-spacer />
      
      <v-btn
        icon="mdi-check"
        color="primary"
        :loading="loading"
        :disabled="loading"
        @click="signUpUser"
      >
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  import { ref } from 'vue'
  import PocketBase from 'pocketbase'
  import PwInput from '@/components/PwInput.vue'

  // 親コンポーネントへのイベント定義
  const emit = defineEmits(['success'])

  const pb = new PocketBase('https://pocketbase.uedasoft.com');

  // two-way bindings
  const email = ref('')
  const pw = ref('')
  const pw2 = ref('')
  const name = ref('')
  const serversideErrors = ref({})
  const loading = ref(false) // 連打防止用のローディング状態

  const showIn = defineModel({ type: Boolean, default: false })

  // Sign Up
  const signUpUser = async ()=>{
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
      // 'users' is the default auth collection in PocketBase
      const record = await pb.collection('users').create(data);
      console.log('Successfully registered:', record.id);

      // login with registered email & pw
      const authData = await pb.collection("users").authWithPassword(email.value, pw.value);

      // 親コンポーネントにログインデータを添えて通知
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

  // Rule: general pw rules
  const passwordRules = [
    v => !!v || 'Cannot be blank.',
    v => (v && v.length >= 8) || 'Must be at least 8 character(s).',
  ]

  // Rule: value of pw2 should match with pw
  const matchRule = (value) => (value == pw.value) || 'password not match.'

</script>