<!-- src/components/DocsMain.vue -->
<template>
  <main class="flex-1 min-w-0">
    <!-- タグ選択ボタン -->
    <div class="flex flex-wrap gap-2 mb-8">
      <button 
        v-for="tag in allTags" 
        :key="tag"
        @click="$emit('update:selectedTag', tag)"
        :class="[
          'px-3 py-1 rounded text-sm transition-all', 
          selectedTag === tag ? 'bg-primary text-white font-medium' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
        ]"
      >
        {{ tag }}
      </button>
    </div>

    <!-- 記事リスト -->
    <div class="space-y-6">
      <article 
        v-for="post in posts" 
        :key="post.path"
        class="group border-b pb-6 last:border-0 p-4 rounded-lg hover:bg-muted/30 transition-colors"
      >
        <a :href="post.path" class="inline-block">
          <h2 class="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors mb-2">
            {{ post.title }}
          </h2>
        </a>
        <div class="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{{ post.date }}</span>
          <div class="flex gap-1">
            <span v-for="t in post.tags" :key="t" class="bg-muted px-2 py-0.5 rounded text-xs">
              {{ t }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </main>
</template>

<script setup>
defineProps({
  posts: {
    type: Array,
    required: true
  },
  allTags: {
    type: Array,
    required: true
  },
  selectedTag: {
    type: String,
    required: true
  }
})

defineEmits(['update:selectedTag'])
</script>
