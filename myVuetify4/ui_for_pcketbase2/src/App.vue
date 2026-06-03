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
  import PocketBase from 'pocketbase'

  // Login Dialog
  import LoginDialog from '@/dialogs/Login.vue'
  let isLoginDialogOpen = ref(false)

  // PocketBase
  onMounted(() => {
    const pb = new PocketBase('https://pocketbase.uedasoft.com');
    if (!pb.authStore.isValid){
      isLoginDialogOpen = true
    }
  })
</script>
