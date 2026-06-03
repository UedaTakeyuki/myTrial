<template>
  <v-app>
    <v-main>
      <LoginDialog v-model="isLoginDialogOpen"/>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { useTemplateRef, onMounted, ref } from 'vue'

  // Login Dialog
  import LoginDialog from '@/dialogs/Login.vue'
  let isLoginDialogOpen = ref(false)

  // PocketBase
  onMounted(() => {
    isLoginDialogOpen = true
  })
</script>
