<template>
  
  <v-responsive
    class="mx-auto"
    max-width="344"
  >
    <p>email:{{email}}</p>
    <p>pw:{{pw}}</p>
    <v-text-field
      v-model="email"
      label="Email address"
      placeholder="johndoe@gmail.com"
      type="email"
    />
    <v-text-field
      v-model="pw"
      hint="Enter your password to access this website"
      label="Password"
      type="input"
    ></v-text-field>
  </v-responsive>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  const email = ref("kerokero@keroro.co.jp")
  const pw = ref("1234")
</script>