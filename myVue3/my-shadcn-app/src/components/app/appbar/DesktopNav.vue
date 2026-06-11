<!-- src/components/DesktopNav.vue -->
<template>
  <div class="hidden md:inline-flex items-center gap-6 text-sm font-medium">
    <RouterLink 
      to="/" 
      class="transition-colors"
      :class="route.path === '/' ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'"
    >
      Dashboard
    </RouterLink>
    <RouterLink 
      to="/projects" 
      class="transition-colors"
      :class="route.path === '/projects' ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'"
    >
      Projects
    </RouterLink>
    <RouterLink 
      to="/settings" 
      class="transition-colors"
      :class="route.path === '/settings' ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'"
    >
      Settings
    </RouterLink>
  </div>
</template>

<script setup>
import { useRoute, RouterLink } from 'vue-router'
const route = useRoute()
</script>
