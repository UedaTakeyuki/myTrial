<!-- src/pages/index.vue -->
<template>
  <div class="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-6 py-12">
    <!-- 💡 修正：ライト・ダーク双方で綺麗に見えるよう、dark:修飾子を使ってインディゴの色味を切り替えます -->
    <span class="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 backdrop-blur-md">
      <span class="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse"></span>
       <!-- 💡 $t ではなく、scriptから取り出した t を使います -->
       {{ t('profile.title') }}
    </span>

    <h1 class="text-4xl font-black tracking-tight sm:text-6xl text-foreground leading-none">
      Welcome to your <br />
      <!-- 💡 修正：メインのアクセントテキストもライトモード用に少し濃いインディゴ（600）へ切り替えます -->
      <span class="text-indigo-600 dark:text-indigo-400 font-extrabold">new project</span>
    </h1>
    
    <!-- 💡 修正：text-zinc-400 から text-muted-foreground に変更 -->
    <p class="text-muted-foreground text-lg max-w-[600px] font-normal leading-relaxed">
      Shadcn Vue とファイルベースルーティングを搭載した、最高にモダンな環境です。
    </p>
  </div>
</template>

<!-- 💡 script setup を追加し、useI18n を宣言します -->
<script setup>
import { useI18n } from 'vue-i18n'

// useI18n を実行することで、下の <i18n> ブロックの翻訳がこのコンポーネントに注入されます
const { t } = useI18n()
</script>

<i18n locale="ja">
{
  "profile": {
    "title": "ホームページ"
  }
}
</i18n>

<i18n locale="en">
{
  "profile": {
    "title": "Home Page"
  }
}
</i18n>
