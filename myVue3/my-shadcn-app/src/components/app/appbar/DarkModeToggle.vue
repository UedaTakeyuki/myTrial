<template>
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
</template>

<script setup>
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-vue-next'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
})
const toggleDark = useToggle(isDark)
</script>
