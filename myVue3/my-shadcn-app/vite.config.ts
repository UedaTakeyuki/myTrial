import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite' // 👈 追加
import Markdown from 'vite-plugin-vue-markdown'
import matter from 'gray-matter' // ★インポートを追加
// ★公式の markdown-it 用プラグインをインポート
import Shiki from '@shikijs/markdown-it'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    VueRouter({
      extensions: ['.vue', '.md'],
      routesFolder: [
        { src: 'src/pages', path: '' },       // 通常の画面用（URL: / ）
        { src: 'src/md', path: 'md/' } // Markdown用（URL: /md/xxx ）
      ],
      dts: false, // ★TSを使わないので型定義の自動生成をオフにします
    }),
    // 2. MarkdownをVueコンポーネントに変換
    Markdown({
      frontmatter: true,
      // ★ markdownItSetup でプラグインを「use」するだけのシンプルな記述に変更
      async markdownItSetup(md) {
        md.use(await Shiki({
          theme: 'github-dark' // お好みのテーマ（dracula, nord 等）
        }))
      }
    }),    // 3. vueプラグインで両方を処理
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
