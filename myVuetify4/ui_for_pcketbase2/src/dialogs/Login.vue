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

  // defineModel を使うことで、親の v-model と自動的に双方向同期されます
  const isOpen = defineModel({ type: Boolean, default: false })
</script>