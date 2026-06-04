<template>
  <v-card
    v-show="true"
    title="Sign Up"
    width="331"
  >
    <v-card-item>
      <v-text-field
        v-model="name"
        label="Name"
        placeholder="Jane Doe"
        type="name"
      />

      <v-text-field
        v-model="email"
        label="Email address"
        placeholder="johndoe@gmail.com"
        type="email"
      />

      <PwInput 
        v-model="pw"
        :rules=passwordRules
      />

      <PwInput 
        v-model="pw2"
        label="Password Confirm"
        hint="Confirm password"
        :rules="[matchRule]"
      />
    </v-card-item>
    <v-card-actions class="justify-end">
      <v-btn
        icon="mdi-check"
        color="primary"
        @click.once="login"
      >
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import PocketBase from 'pocketbase'
  import PwInput from '@/components/PwInput.vue'

  const email = ref()
  const pw = ref()
  const pw2 = ref()
  const name = ref()

  const showPassword = ref(false)

  // Sign Up
  const login = async ()=>{
    const pb = new PocketBase('https://pocketbase.uedasoft.com');
    const authData = await pb.collection("users").authWithPassword(email.value, pw.value);
    location.reload();
  }

  // Rules: value of pw2 should match with pw
  const matchRule = (value) => (value == pw.value) || 'password not match.'

  const passwordRules = [
    v => !!v || 'パスワードを入力してください。',
    v => (v && v.length >= 8) || 'パスワードは8文字以上で入力してください。',
  ]
</script>