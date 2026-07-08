import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export function useDocs() {
  const { locale } = useI18n()
  
  const posts = ref([])
  const selectedTag = ref('All')
  const searchQuery = ref('') // 検索キーワード用の状態

  const loadPosts = async () => {
    const files = import.meta.glob('@/md/**/*.md')
    const rawFiles = import.meta.glob('@/md/**/*.md', { query: '?raw' })
    const postsArray = []

    // 1. 【修正】[0] を追加して配列の先頭文字を小文字化
    const langCode = locale.value.split('-')[0].toLowerCase()

    for (const path in files) {
      const localePathSnippet = `/md/${langCode}/`
      if (!path.includes(localePathSnippet)) {
        continue
      }

      const mod = await files[path]()
      if (!mod) continue

      const matchPath = path.match(/(?:\/src\/md|\/md)\/([^/]+)\/(.+)\.md$/)
      let urlPath = ''

      if (matchPath) {
        // 2. 【修正】[1] と [2] を正しく指定
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

      // 3. 【修正】末尾に [0] を追加して日付文字列のみを抽出
      if (date) {
        date = new Date(date).toISOString().split('T')[0]
      }

      const articleToc = [{ path: urlPath, text: title, depth: 1 }]
      let content = '' // 本文格納用の変数

      if (rawFiles[path]) {
        const rawMod = await rawFiles[path]()
        content = rawMod.default || '' // プレーンテキストを取得
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

      // 4. 【確認済】content を含めて正しくプッシュ
      postsArray.push({ path: urlPath, title, date, tags, toc: articleToc, content })
    }

    posts.value = postsArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  onMounted(() => {
    loadPosts()
  })

  watch(() => locale.value, () => {
    searchQuery.value = '' 
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

  // タグ絞り込み ＋ 検索ワード絞り込み
  const filteredPosts = computed(() => {
    let result = posts.value

    if (selectedTag.value !== 'All') {
      result = result.filter(post => post.tags.includes(selectedTag.value))
    }

    const query = searchQuery.value.trim().toLowerCase()
    if (query) {
      result = result.filter(post => {
        const matchTitle = post.title.toLowerCase().includes(query)
        const matchContent = post.content.toLowerCase().includes(query)
        const matchTags = post.tags.some(tag => tag.toLowerCase().includes(query))
        
        return matchTitle || matchContent || matchTags
      })
    }

    return result
  })

  const globalToc = computed(() => {
    const tocList = []
    filteredPosts.value.forEach(post => {
      if (post.toc) tocList.push(...post.toc)
    })
    return tocList
  })

  return {
    searchQuery,
    selectedTag,
    allTags,
    filteredPosts,
    globalToc
  }
}
