import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite' // 👈 追加
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    VueRouter({
      /* オプション指定が必要な場合はここに記述（デフォルトは src/pages） */
    }),
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
