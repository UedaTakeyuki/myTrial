// src/composables/useDocs.ts (または .js)
import { ref, computed, onMounted } from 'vue'

export function useDocs() {
  const posts = ref([])
  const selectedTag = ref('All')

  onMounted(async () => {
    // 1. 両方とも `@/` に統一します
    const files = import.meta.glob('@/md/**/*.md')
    const rawFiles = import.meta.glob('@/md/**/*.md', { query: '?raw' })
    const postsArray = []

    for (const path in files) {
      const mod = await files[path]()
      if (!mod) continue

      // 2. パスの置換元を、globに合わせた文字列に変更します
      // Viteのエイリアス glob は通常 "/src/md/..." というキーになります
      const urlPath = path
        .replace('/src/md', '/md') // キーが /src/md の場合
        .replace('@/md', '/md')    // 環境によってキーが @/md になる場合への備え
        .replace('.md', '')
        .replace('/index', '')

      const title = mod.title || mod.frontmatter?.title || mod.default?.title || '無題'
      let date = mod.date || mod.frontmatter?.date || mod.default?.date || ''
      const tags = mod.tags || mod.frontmatter?.tags || mod.default?.tags || []

      if (date) {
        date = new Date(date).toISOString().split('T')[0]
      }

      const articleToc = [{ path: urlPath, text: title, depth: 1 }]

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

      postsArray.push({ path: urlPath, title, date, tags, toc: articleToc })
    }

    posts.value = postsArray.sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  const allTags = computed(() => {
    const tagsSet = new Set(['All'])
    posts.value.forEach(post => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach(tag => tagsSet.add(tag))
      }
    })
    return Array.from(tagsSet)
  })

  const filteredPosts = computed(() => {
    if (selectedTag.value === 'All') return posts.value
    return posts.value.filter(post => post.tags.includes(selectedTag.value))
  })

  const globalToc = computed(() => {
    const tocList = []
    filteredPosts.value.forEach(post => {
      if (post.toc) tocList.push(...post.toc)
    })
    return tocList
  })

  return {
    selectedTag,
    allTags,
    filteredPosts,
    globalToc
  }
}
