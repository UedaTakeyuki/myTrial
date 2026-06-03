<template>
<v-dialog
  v-model="isOpen"
  width="auto"
>
  <v-card
    prepend-icon="mdi-login"
    subtitle="Sign In/Up"
  >

    <LoginDialog/>

    <v-divider/>

  </v-card>
</v-dialog>
</template>

<script setup>
  import LoginDialog from '@/components/Login.vue'
</script>