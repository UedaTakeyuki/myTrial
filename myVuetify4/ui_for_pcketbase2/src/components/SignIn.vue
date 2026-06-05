<template>
  <v-card
    v-show="showIn"
    title="Sign In"
    width="331"
  >
    <v-card-item>
      <v-text-field
        class="mx-1"
        v-model="email"
        label="Email address"
        placeholder="johndoe@gmail.com"
        type="email"
      />

      <PwInput 
        class="ma-1"
        v-model="pw"
      />
    </v-card-item>

    <v-card-actions class="justify-end" px-4 pb-4>
      <v-btn @click="showIn = !showIn" variant="text" size="x-small">
        or Sign Up?
      </v-btn>

      <v-spacer />

      <v-btn
        color="primary"
        variant="elevated"
        append-icon="mdi-send"
        @click="login"
      >
    Login
  </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import PocketBase from 'pocketbase'
  import PwInput from '@/components/PwInput.vue'

  const email = ref("")
  const pw = ref("")

  const showIn = defineModel({ type: Boolean, default: false })

  const login = async ()=>{
    const pb = new PocketBase('https://pocketbase.uedasoft.com');
    try {
      const authData = await pb.collection("users").authWithPassword(email.value, pw.value);
      location.reload();
    } catch (error) {
      // エラーハンドリング
      console.error("Login failed:", error)
      console.log(error)
      alert("ログインに失敗しました。メールアドレスまたはパスワードを確認してください。")
    }
  }
</script>