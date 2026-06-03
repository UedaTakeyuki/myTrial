<template>
  <v-card
    v-show="true"
    title="Sign Up"
    width="400"
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
      />

      <PwInput 
        v-model="pw2"
        label="Password Confirm"
        hint="Confirm password again"
      />
    </v-card-item>
    <v-card-actions>
      <v-fab
        class="ma-1"
        @click.once="login"
      >
        Login
      </v-fab>
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

  const login = async ()=>{
    const pb = new PocketBase('https://pocketbase.uedasoft.com');
    const authData = await pb.collection("users").authWithPassword(email.value, pw.value);
    location.reload();
  }
</script>