<template>
  <div>
    <!-- タグのボタン一覧（shadcnのBadgeやButtonを使うと綺麗です） -->
    <div class="flex gap-2 mb-6">
      <button 
        v-for="tag in allTags" 
        :key="tag"
        @click="selectedTag = tag"
        :class="['px-3 py-1 rounded text-sm', selectedTag === tag ? 'bg-primary text-white' : 'bg-secondary']"
      >
        {{ tag }}
      </button>
    </div>

    <!-- 絞り込まれた記事一覧 -->
    <ul class="space-y-4">
      <li v-for="post in filteredPosts" :key="post.path">
        <router-link :to="post.path" class="text-xl font-bold">{{ post.title }}</router-link>
        <p class="text-sm text-muted-foreground">{{ post.date }}</p>
      </li>
    </ul>
  </div>
</template>

<!-- docs.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'

const posts = ref([])
const selectedTag = ref('All')

onMounted(async() => {
  // 1. 【高速化】{ eager: true } を削除して非同期の関数リストに戻します
  const files = import.meta.glob('../md/**/*.md')
  const postsArray = []

  for (const path in files) {
    const mod = await files[path]()

    if (!mod) continue

    // URLパスを生成
    const urlPath = path
      .replace('../md', '/md')
      .replace('.md', '')
      .replace('/index', '')

    // ★最新仕様のポイント: Frontmatterの項目は、オブジェクトの直下に直接エクスポートされています！
    // もしくは、モジュールそのもの、または default のプロパティから安全にフォールバックします。
    const title = mod.title || mod.frontmatter?.title || mod.default?.title || '無題'
    const date = mod.date || mod.frontmatter?.date || mod.default?.date || ''
    const tags = mod.tags || mod.frontmatter?.tags || mod.default?.tags || []

    postsArray.push({
      path: urlPath,
      title,
      // ★ 修正：もし日付データ（date）があれば、最初の10文字（YYYY-MM-DD）だけを切り取る
      date: date ? new Date(date).toISOString().split('T')[0] : '',
      tags
    })
  }

  // 日付順に並び替え
  posts.value = postsArray.sort((a, b) => new Date(b.date) - new Date(a.date))
})

// タグ一覧を自動集計する処理
const allTags = computed(() => {
  const tagsSet = new Set(['All'])
  posts.value.forEach(post => {
    if (Array.isArray(post.tags)) {
      post.tags.forEach(tag => tagsSet.add(tag))
    }
  })
  return Array.from(tagsSet)
})

// タグ絞り込み処理
const filteredPosts = computed(() => {
  if (selectedTag.value === 'All') return posts.value
  return posts.value.filter(post => post.tags.includes(selectedTag.value))
})
</script>
