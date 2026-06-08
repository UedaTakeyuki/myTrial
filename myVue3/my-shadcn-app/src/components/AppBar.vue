<!-- src/components/AppBar.vue -->
<template>
  <nav class="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur-md">
    <div class="container flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6 mx-auto">
      
      <!-- 左側：ナビゲーション群 -->
      <div class="flex items-center gap-4 sm:gap-8">
        <!-- 1. モバイル用ハンバーガー -->
        <MobileNav />

        <!-- ロゴ -->
        <RouterLink class="flex items-center space-x-2 font-bold tracking-wider text-lg hover:opacity-90 transition-opacity" to="/">
          <div class="h-5 w-5 rounded bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-lg shadow-indigo-500/30"></div>
          <!-- 💡 後半の「App」をアクセントカラー（または元のtext-indigo-400など固定色）にすると見栄えが良いです -->
          <span class="text-foreground font-extrabold">Vue<span class="text-primary">App</span></span>
        </RouterLink>
        
        <!-- 2. PC用横並びナビ -->
        <DesktopNav />
      </div>

      <!-- 右側：アクションボタン群 -->
      <div class="flex items-center gap-2 sm:gap-3">

        <!-- 4. 明暗反転（ダークモード）切り替えトグル -->
        <Button 
          variant="ghost" 
          size="icon" 
          class="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
          @click="toggleDark()"
        >
          <Sun v-if="isDark" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
          <span class="sr-only">テーマ切り替え</span>
        </Button>

        <!-- 💡 修正：ホバー時の背景と文字色をセマンティックカラーに変更 -->
        <Button variant="ghost" size="icon" class="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg">
          <Search class="h-4 w-4" />
        </Button>

        <!-- 💡 修正：ホバー時の背景と文字色をセマンティックカラーに変更 -->
        <Button variant="ghost" size="icon" class="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg">
          <Bell class="h-4 w-4" />
        </Button>

        <!-- 💡 修正：区切り線の背景色を bg-border に変更 -->
        <div class="h-4 w-[1px] bg-border mx-1"></div>

        <!-- 3. ユーザーメニュー -->
        <UserMenu />
      </div>

    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Search, Bell, Sun, Moon } from 'lucide-vue-next'
import { useDark, useToggle } from '@vueuse/core'

import MobileNav from './MobileNav.vue'
import DesktopNav from './DesktopNav.vue'
import UserMenu from './UserMenu.vue'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
})
const toggleDark = useToggle(isDark)
</script>
