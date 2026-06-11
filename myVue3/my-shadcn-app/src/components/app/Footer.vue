<!-- src/components/Footer.vue -->
<template>
  <footer class="w-full border-t border-border bg-background/50 backdrop-blur-md">
    <div class="container mx-auto max-w-screen-xl px-6 py-12 md:py-16">
      
      <!-- メインリンクエリア -->
      <div class="xl:grid xl:grid-cols-3 xl:gap-8 pb-12 border-b border-border/60">
        
        <!-- 左側：ブランド・説明 -->
        <div class="space-y-4 xl:col-span-1">
          <RouterLink class="flex items-center space-x-2 font-bold tracking-wider text-xl hover:opacity-90 transition-opacity" to="/">
            <div class="h-5 w-5 rounded bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-lg shadow-indigo-500/30"></div>
            <span class="text-foreground font-extrabold">Vue<span class="text-primary">App</span></span>
          </RouterLink>
          <p class="text-muted-foreground text-sm max-w-xs leading-relaxed">
            Shadcn Vue と Tailwind v4 をベースにした、次世代の Web アプリケーションテンプレート。
          </p>
          <!-- SNSアイコン等を入れるスペース（Lucide等でお好みで拡張可能） -->
        </div>

        <!-- 右側：ナビゲーション群（3列構成） -->
        <div class="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 sm:grid-cols-3">
          <!-- 1列目 -->
          <div>
            <h3 class="text-sm font-bold text-foreground tracking-wider uppercase">Product</h3>
            <ul role="list" class="mt-4 space-y-2.5">
              <li><RouterLink to="/" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</RouterLink></li>
              <li><RouterLink to="/" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</RouterLink></li>
              <li><RouterLink to="/" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Changelog</RouterLink></li>
            </ul>
          </div>

          <!-- 2列目 -->
          <div>
            <h3 class="text-sm font-bold text-foreground tracking-wider uppercase">Resources</h3>
            <ul role="list" class="mt-4 space-y-2.5">
              <li><RouterLink to="/projects" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Projects</RouterLink></li>
              <li><a href="#" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
            </ul>
          </div>

          <!-- 3列目 -->
          <div class="col-span-2 sm:col-span-1">
            <h3 class="text-sm font-bold text-foreground tracking-wider uppercase">Company</h3>
            <ul role="list" class="mt-4 space-y-2.5">
              <li><RouterLink to="/settings" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Settings</RouterLink></li>
              <li><a href="#" class="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

      </div>

      <!-- 下部エリア：コピーライト等 -->
      <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>&copy; 2026 VueApp Inc. All rights reserved.</p>
        <div class="flex gap-6">
          <a href="#" class="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="#" class="hover:text-foreground transition-colors">Privacy Policy</a>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
