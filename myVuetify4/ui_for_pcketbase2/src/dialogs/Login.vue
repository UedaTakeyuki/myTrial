<template>
<v-dialog
  v-model="isOpen"
  width="auto"
>
  <v-card
    prepend-icon="mdi-login"
    subtitle="Sign In/Up"
  >

    <SignInDlg v-model="showIn"/>
    <SignUpDlg v-model="showIn"/>
  </v-card>
</v-dialog>
</template>

<script setup>
  import SignInDlg from '@/components/SignIn.vue'
  import SignUpDlg from '@/components/SignUp.vue'
  import { ref, onMounted } from 'vue'

  const showIn = ref(true)

  // defineModel を使うことで、親の v-model と自動的に双方向同期されます
  const isOpen = defineModel({ type: Boolean, default: false })
</script>