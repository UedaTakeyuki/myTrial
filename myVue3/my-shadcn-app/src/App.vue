<!-- src/App.vue -->
<template>
  <!-- 💡 flex flex-col を追加して縦並びのレイアウトにします -->
  <div class="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
    
    <!-- トップナビゲーション -->
    <AppBar />

    <!-- 💡 flex-1 を追加して、コンテンツが少ない時もフッターを下に押し下げます -->
    <main class="container mx-auto px-6 py-12 max-w-screen-xl flex-1">
      <RouterView />
    </main>
    
    <!-- 💡 追加：フッターを呼び出す -->
    <Footer />

  </div>
</template>

<script setup>
import AppBar from '@/components/AppBar.vue'
import Footer from '@/components/Footer.vue' // 💡 インポートを追加
</script>
