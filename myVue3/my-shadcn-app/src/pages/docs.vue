<!-- src/pages/docs.vue -->
<template>
  <div class="container mx-auto flex gap-8 py-10">
    
    <!-- 1. 左側：全Markdownファイルを連結した総合目次（ナビゲーション） -->
    <aside class="w-64 shrink-0 hidden md:block">
      <div class="sticky top-20 border-r pr-4 h-[calc(100vh-8rem)] overflow-y-auto">
        <p class="text-sm font-semibold tracking-tight text-muted-foreground mb-4 uppercase">
          Document Menu
        </p>
        
        <ul class="space-y-2 text-sm">
          <!-- 全記事の見出しをループで一括表示 -->
          <li v-for="(item, index) in globalToc" :key="index" :style="{ paddingLeft: `${(item.depth - 1) * 0.75}rem` }">
            <router-link 
              :to="item.path" 
              :class="[
                'block transition-colors hover:text-foreground',
                item.depth === 1 
                  ? 'font-bold text-foreground mt-4 first:mt-0 text-base' 
                  : 'text-muted-foreground text-xs py-0.5'
              ]"
            >
              <!-- 見出しの深さに応じて記号を付けると見やすくなります -->
              <span v-if="item.depth > 1" class="text-muted-foreground/40 mr-1">#</span>
              {{ item.text }}
            </router-link>
          </li>
          
          <li v-if="globalToc.length === 0" class="text-xs italic text-muted-foreground/60">
            メニューを読み込み中...
          </li>
        </ul>
      </div>
    </aside>

    <!-- 2. 右側：メインコンテンツ領域（記事カード一覧） -->
    <main class="flex-1 min-w-0">
      <!-- タグ選択ボタン -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button 
          v-for="tag in allTags" 
          :key="tag"
          @click="selectedTag = tag"
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
          v-for="post in filteredPosts" 
          :key="post.path"
          class="group border-b pb-6 last:border-0 p-4 rounded-lg hover:bg-muted/30 transition-colors"
        >
          <!-- 💡【ここを書き換えます】 -->
          <!-- ❌ 修正前： :to="post.path" -->
          <!-- <router-link :to="post.path" class="inline-block"> -->
          <!-- ⭕ 修正後： 文字列を直接 `aタグ` に流し込むか、オブジェクト形式にする -->
          <!-- 一番確実なのは、aタグの「href」として直接文字を渡してしまう方法です -->
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

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const posts = ref([])
const selectedTag = ref('All')

onMounted(async () => {
  const files = import.meta.glob('../md/**/*.md')
  const rawFiles = import.meta.glob('../md/**/*.md', { query: '?raw' })
  
  const postsArray = []

  for (const path in files) {
    const mod = await files[path]()
    if (!mod) continue

    const urlPath = path.replace('../md', '/md').replace('.md', '').replace('/index', '')
    const title = mod.title || mod.frontmatter?.title || mod.default?.title || '無題'
    let date = mod.date || mod.frontmatter?.date || mod.default?.date || ''
    const tags = mod.tags || mod.frontmatter?.tags || mod.default?.tags || []

    if (date) {
      date = new Date(date).toISOString().split('T')[0]
    }

    // 💡 各記事オブジェクトに、あらかじめその記事内の見出しリスト（toc）を持たせるようにします
    const articleToc = []
    
    // 1. まず記事自身のタイトルを depth: 1 として追加
    articleToc.push({
      path: urlPath,
      text: title,
      depth: 1
    })

    // 2. 記事内の ## や ### を抽出して追加
    if (rawFiles[path]) {
      const rawMod = await rawFiles[path]()
      const content = rawMod.default || ''
      const lines = content.split('\n')

      lines.forEach((line) => {
        const match = line.match(/^(##|###)\s+(.+)$/)
        if (match) {
          const depth = match[1] === '##' ? 2 : 3
          const text = match[2].trim()
          const anchor = text.toLowerCase().replace(/\s+/g, '-')
          
          articleToc.push({
            path: `${urlPath}#${anchor}`,
            text,
            depth
          })
        }
      })
    }

    // 記事データに toc を含めて配列にプッシュ
    postsArray.push({ path: urlPath, title, date, tags, toc: articleToc })
  }

  // 右側の記事一覧を日付が新しい順にソートして格納
  posts.value = postsArray.sort((a, b) => new Date(b.date) - new Date(a.date))
})

// タグ集計
const allTags = computed(() => {
  const tagsSet = new Set(['All'])
  posts.value.forEach(post => {
    if (Array.isArray(post.tags)) {
      post.tags.forEach(tag => tagsSet.add(tag))
    }
  })
  return Array.from(tagsSet)
})

// 💡 1. 選択されたタグに一致する記事一覧（日付順にソート済み）
const filteredPosts = computed(() => {
  if (selectedTag.value === 'All') return posts.value
  return posts.value.filter(post => post.tags.includes(selectedTag.value))
})

// 💡 2. 絞り込まれた記事一覧から、見出しリスト（TOC）をリアルタイムに自動生成する
const globalToc = computed(() => {
  const tocList = []
  // 絞り込み済みの記事をループして、それぞれの見出しを1本の配列に連結する
  filteredPosts.value.forEach(post => {
    if (post.toc) {
      tocList.push(...post.toc)
    }
  })
  return tocList
})
</script>
