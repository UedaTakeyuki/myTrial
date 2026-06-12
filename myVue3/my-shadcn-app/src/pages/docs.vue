<!-- src/pages/docs.vue -->
<template>
  <div class="container mx-auto flex gap-8 py-10">
    
    <!-- 1. 左側：サイドバー -->
    <DocsSidebar :toc="globalToc" />

    <!-- 2. 右側：メインコンテンツ領域 -->
    <DocsMain 
      :posts="filteredPosts"
      :all-tags="allTags"
      v-model:selectedTag="selectedTag"
    />

  </div>
</template>

<script setup>
import DocsSidebar from '@/components/docs/DocsSidebar.vue'
import DocsMain from '@/components/docs/DocsMain.vue'
import { useDocs } from '@/composables/docs/useDocs.js'

const { selectedTag, allTags, filteredPosts, globalToc } = useDocs()
</script>