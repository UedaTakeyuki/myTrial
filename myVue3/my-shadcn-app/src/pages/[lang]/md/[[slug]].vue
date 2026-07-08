<!-- src/pages/md/[slug].vue -->
<template>
  <div class="container mx-auto flex gap-8 py-10 px-4 md:px-6">
    
    <!-- 1. 左側：この記事専用の目次サイドバー（このコンポーネント内だけで完結） -->
    <aside class="w-64 shrink-0 hidden md:block">
      <div class="sticky top-24 border-r pr-4 h-[calc(100vh-8rem)] overflow-y-auto">
        <p class="text-sm font-semibold tracking-tight text-muted-foreground mb-4 uppercase">
          On This Page
        </p>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li v-for="(item, index) in toc" :key="index" 
              :style="{ paddingLeft: `${(item.depth - 2) * 0.75}rem` }"
              class="hover:text-foreground transition-colors"
          >
            <a :href="`#${item.id}`" class="block py-0.5">{{ item.text }}</a>
          </li>
        </ul>
      </div>
    </aside>

    <!-- 2. 右側：Markdownの本文を動的にレンダリングする領域 -->
    <main class="flex-1 min-w-0">
      <!-- 💡 インポートしたMarkdownコンポーネントをここに動的に表示 -->
      <component :is="markdownComponent" v-if="markdownComponent" />
    </main>

  </div>
</template>

<<script setup>
import { ref, watch, nextTick, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const markdownComponent = shallowRef(null)
const toc = ref([])

// 💡 1. 変更：相対パスをやめ、エイリアス（@/）を使って大元の場所を固定します
// これにより、ファイルがどのフォルダ階層に移動してもパスが絶対に壊れなくなります
const markdownModules = import.meta.glob('@/md/**/*.md')

watch(
  () => [route.params.lang, route.params.slug], 
  async ([newLang, newSlug]) => {
    const targetLang = newLang || 'en'
    const targetSlug = newSlug || 'index'
    
    // 💡 2. 変更：上の glob と1文字違わず完全に一致するエイリアスパスを組み立てます
    const targetPath = `/src/md/${targetLang}/${targetSlug}.md`
    
    try {
      // Vite の仕様上、glob に @/ を使うと、キー名は内部的に「/src/md/...」の形で登録されます
      // そのため、組み立てたパスが登録リストに存在するかチェックします
      if (markdownModules[targetPath]) {
        const mod = await markdownModules[targetPath]()
        markdownComponent.value = mod.default
      } else {
        // 💡 デバッグ用：どうしても見つからない場合、Viteが現在認識している正しいパスのリストをコンソールに流します
        console.warn('Viteが認識している正しいパス一覧:', Object.keys(markdownModules))
        throw new Error(`File not found in glob: ${targetPath}`)
      }

      // DOMの描画完了を待ってから、このコンポーネント内にある見出し（h2, h3）を抽出
      await nextTick()
      setTimeout(() => {
        const headings = document.querySelectorAll('.prose h2, .prose h3')
        const tocItems = []

        headings.forEach((heading, index) => {
          if (!heading.id) heading.id = `section-${index}`
          tocItems.push({
            id: heading.id,
            text: heading.innerText || heading.textContent,
            depth: parseInt(heading.tagName.replace('H', ''), 10)
          })
        })
        toc.value = tocItems
      }, 100)
    } catch (e) {
      console.error('Markdownファイルの読み込みに失敗しました', e)
      markdownComponent.value = null
      toc.value = []
    }
  }, 
  { immediate: true }
)
</script>
