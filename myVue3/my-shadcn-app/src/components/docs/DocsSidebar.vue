<!-- src/components/DocsSidebar.vue -->
<template>
  <aside class="w-64 shrink-0 hidden md:block">
    <div class="sticky top-20 border-r pr-4 h-[calc(100vh-8rem)] overflow-y-auto">
      <p class="text-sm font-semibold tracking-tight text-muted-foreground mb-4 uppercase">
        Document Menu
      </p>
      
      <ul class="space-y-2 text-sm">
        <li v-for="(item, index) in toc" :key="index" :style="{ paddingLeft: `${(item.depth - 1) * 0.75}rem` }">
          <router-link 
            :to="item.path" 
            :class="[
              'block transition-colors hover:text-foreground',
              item.depth === 1 
                ? 'font-bold text-foreground mt-4 first:mt-0 text-base' 
                : 'text-muted-foreground text-xs py-0.5'
            ]"
          >
            <span v-if="item.depth > 1" class="text-muted-foreground/40 mr-1">#</span>
            {{ item.text }}
          </router-link>
        </li>
        
        <li v-if="toc.length === 0" class="text-xs italic text-muted-foreground/60">
          メニューを読み込み中...
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  toc: {
    type: Array,
    required: true
  }
})
</script>