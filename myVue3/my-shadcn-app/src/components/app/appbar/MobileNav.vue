<!-- src/components/MobileNav.vue -->
<template>
  <Sheet v-model:open="isOpen">
    <SheetTrigger as-child>
      <!-- 💡 修正：hover:bg-zinc-900 から hover:bg-accent に変更 -->
      <!--<Button variant="ghost" size="icon" class="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent block md:hidden rounded-lg">-->
      <!-- 💡 block を inline-flex に変更しました -->
      <Button variant="ghost" size="icon" class="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent inline-flex md:hidden rounded-lg">
      <Menu class="h-5 w-5" />
        <span class="sr-only">Toggle Menu</span>
      </Button>
    </SheetTrigger>
    <!-- 💡 修正：独自の背景色や枠線、文字色の固定クラス（bg-zinc-950 など）を削除 -->
    <SheetContent side="left" class="w-[300px] p-6 flex flex-col justify-between">
      <div class="space-y-6">
        <SheetHeader class="text-left">
          <SheetTitle class="text-foreground flex items-center gap-2 font-extrabold tracking-wider">
            <div class="h-5 w-5 rounded bg-gradient-to-tr from-violet-600 to-indigo-500"></div>
            Vue<span class="text-primary">App</span>
          </SheetTitle>
          <QRcode class="mb-2">
            <template v-slot:title>
              Scan to get this site.
            </template>
          </QRcode>
        </SheetHeader>
        
        <div class="flex flex-col gap-3 font-medium text-base mt-4">
          <!-- 💡 修正：アクティブ時・ホバー時の背景クラスをセマンティックカラー（bg-secondary、bg-accent）に変更 -->
          <RouterLink 
            to="/" 
            @click="closeMenu"
            class="px-3 py-2 rounded-lg transition-colors"
            :class="route.path === '/' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'"
          >
            Dashboard
          </RouterLink>
          <RouterLink 
            to="/projects" 
            @click="closeMenu"
            class="px-3 py-2 rounded-lg transition-colors"
            :class="route.path === '/projects' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'"
          >
            Projects
          </RouterLink>
          <RouterLink 
            to="/settings" 
            @click="closeMenu"
            class="px-3 py-2 rounded-lg transition-colors"
            :class="route.path === '/settings' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'"
          >
            Settings
          </RouterLink>
        </div>
      </div>
      <!-- 💡 修正：border-zinc-800 を border-border に変更 -->
      <div class="text-xs text-muted-foreground border-t border-border pt-4">
        © 2026 VueApp Inc.
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup>
import { ref } from 'vue'
import { QRcode } from 'qrcode-of-this-site3'
import { useRoute, RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-vue-next'

const route = useRoute()
const isOpen = ref(false)
const closeMenu = () => { isOpen.value = false }
</script>
