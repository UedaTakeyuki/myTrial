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

<script setup>
import { ref, watch, nextTick, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const markdownComponent = shallowRef(null)
const toc = ref([])

// URLの [slug] に合わせて、対象のMarkdownファイルを動的にインポートする
watch(() => route.params.slug, async (newSlug) => {
  // if (!newSlug) return
  // 💡【ここを修正します】
  // URLが /md のとき（newSlugが空、またはundefinedのとき）は、
  // 自動的に 'index' というファイル名（index.md）を読み込むようにフォールバックさせます。
  const targetSlug = newSlug || 'index'
  
  try {
    // ❌ 修正前: 誤って元の空の変数を読み込んでいました
    // const mod = await import(`../../md/${newSlug}.md`)
    // ⭕ 修正後: 正しくフォールバックさせた targetSlug を読み込みます
    const mod = await import(`../../md/${targetSlug}.md`)
    markdownComponent.value = mod.default

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
  }
}, { immediate: true })
</script>