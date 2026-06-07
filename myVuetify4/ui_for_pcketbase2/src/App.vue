<template>
  <v-app>

    <Navbar/>

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

  // Navbar
  import Navbar from '@/components/Navbar.vue'

  // Menu
  const links = [
    { icon: 'home', text: 'Home', route: '/'},
    { icon: 'face', text: 'Account', route: '/account'},
    { icon: 'shop', text: 'Purchase', route: '/purchase'},
  ];

  // PocketBase
  onMounted(() => {
    const pb = new PocketBase('https://pocketbase.uedasoft.com');
    if (!pb.authStore.isValid){
      isLoginDialogOpen.value = true
    }
  })
</script>
