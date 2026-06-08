<!-- src/App.vue -->
<template>
  <!-- 💡 修正：bg-zinc-950 text-zinc-50 から bg-background text-foreground に変更 -->
  <div class="min-h-screen bg-background text-foreground font-sans antialiased">
    
    <!-- 切り出した AppBar を呼び出す -->
    <AppBar />

    <!-- URLによって中身が切り替わるエリア -->
    <main class="container mx-auto px-6 py-12 max-w-screen-xl">
      <RouterView />
    </main>
    
  </div>
</template>

<script setup>
// 作成したAppBarコンポーネントをインポート
import AppBar from '@/components/AppBar.vue'
</script>
