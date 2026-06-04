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

    <v-card-actions class="justify-end">
      <v-btn @click="showIn = !showIn">Sign Up</v-btn>

      <v-spacer />

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

  const email = ref("hba01111@nifty.com")
  const pw = ref("dista226")

  const showIn = defineModel({ type: Boolean, default: false })

  const login = async ()=>{
    const pb = new PocketBase('https://pocketbase.uedasoft.com');
    const authData = await pb.collection("users").authWithPassword(email.value, pw.value);
    location.reload();
  }
</script>