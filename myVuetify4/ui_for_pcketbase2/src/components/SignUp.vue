<template>
  <v-card
    v-show="true"
  >
    <p>Sign In</p>
    <v-text-field
      class="mx-1"
      v-model="email"
      label="Email address"
      placeholder="johndoe@gmail.com"
      type="email"
    />
    <v-text-field
      class="mx-1"
      v-model="pw"
      hint="Enter your password to access this website"
      label="Password"
      :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="showPassword = !showPassword" 
    />
    <v-btn
      class="ma-1"
      @click.once="login"
    >
      Login
    </v-btn>
  </v-card>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import PocketBase from 'pocketbase'

  const email = ref("hba01111@nifty.com")
  const pw = ref("dista226")

  const showPassword = ref(false)

  const login = async ()=>{
    const pb = new PocketBase('https://pocketbase.uedasoft.com');
    const authData = await pb.collection("users").authWithPassword(email.value, pw.value);
    location.reload();
  }
</script>