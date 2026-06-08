<!-- src/App.vue -->
<template>
  <!-- 💡 flex flex-col を追加して縦並びのレイアウトにします -->
  <div class="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
    
    <!-- トップナビゲーション -->
    <AppBar />

    <!-- 💡 flex-1 を追加して、コンテンツが少ない時もフッターを下に押し下げます -->
    <main class="container mx-auto px-6 py-12 max-w-screen-xl flex-1">
      <LoginDialog v-model="isLoginDialogOpen"/>
      <RouterView />
    </main>
    
    <!-- 💡 追加：フッターを呼び出す -->
    <Footer />

  </div>
</template>

<script setup>
import {onMounted, ref, provide} from 'vue'
import PocketBase from 'pocketbase'
import AppBar from '@/components/AppBar.vue'
import Footer from '@/components/Footer.vue' // 💡 インポートを追加

// Login Dialog
import LoginDialog from '@/dialogs/Login.vue'
let isLoginDialogOpen = ref(false)

// 💡 追加：ダイアログを開く関数を作成し、子コンポーネントへ provide する
const openLoginDialog = () => {
  isLoginDialogOpen.value = true
}
provide('openLoginDialog', openLoginDialog)

// PocketBase
onMounted(() => {
  const pb = new PocketBase('https://pocketbase.uedasoft.com');
  if (!pb.authStore.isValid){
    openLoginDialog() // 作成した関数を使う形に統一
  }
})
</script>
