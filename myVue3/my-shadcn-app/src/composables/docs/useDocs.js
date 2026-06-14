import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n' // ★内部でインポート

export function useDocs() { // ★引数は不要
  const { locale } = useI18n() // ★内部でロケールを取得
  
  const posts = ref([])
  const selectedTag = ref('All')

  const loadPosts = async () => {
    const files = import.meta.glob('@/md/**/*.md')
    const rawFiles = import.meta.glob('@/md/**/*.md', { query: '?raw' })
    const postsArray = []

    // ロケール名（例: "ja-JP" や "ja"）から先頭の2文字（"ja"）を抽出
    const langCode = locale.value.split('-')[0].toLowerCase()

    for (const path in files) {
      // 選択中の言語フォルダのみに絞り込み
      const localePathSnippet = `/md/${langCode}/`
      if (!path.includes(localePathSnippet)) {
        continue
      }

      const mod = await files[path]()
      if (!mod) continue

      // パスから言語とファイル名を取り出す
      const matchPath = path.match(/(?:\/src\/md|\/md)\/([^/]+)\/(.+)\.md$/)
      let urlPath = ''

      if (matchPath) {
        const lang = matchPath[1]
        let id = matchPath[2]
        if (id === 'index') id = ''
        urlPath = `/${lang}/md/${id}`
      } else {
        urlPath = path
          .replace('/src/md', '/md')
          .replace('@/md', '/md')
          .replace('.md', '')
          .replace('/index', '')
      }

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

    posts.value = postsArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  onMounted(() => {
    loadPosts()
  })

  // ★ 内部の locale をそのまま監視
  watch(() => locale.value, () => {
    loadPosts()
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
