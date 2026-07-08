<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button 
        variant="ghost" 
        size="icon" 
        class="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
      >
        <Languages class="h-4 w-4" />
        <span class="sr-only">言語切り替え</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="changeLocale('ja')" :class="{ 'bg-accent text-accent-foreground': locale === 'ja' }">
        日本語
      </DropdownMenuItem>
      <DropdownMenuItem @click="changeLocale('en')" :class="{ 'bg-accent text-accent-foreground': locale === 'en' }">
        English
      </DropdownMenuItem>
      <DropdownMenuItem @click="changeLocale('fr')" :class="{ 'bg-accent text-accent-foreground': locale === 'fr' }">
        Français
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-vue-next' 
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n' 
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

const { locale } = useI18n()
const savedLocale = useStorage('user-locale', locale.value)

// 初期起動時に保存された言語を適用
locale.value = savedLocale.value

const changeLocale = (lang) => {
  locale.value = lang
  savedLocale.value = lang
}
</script>
