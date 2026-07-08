// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes' // 👈 プラグインが自動生成したルートをインポート

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // 自動生成されたルートをそのまま渡す
})

export default router
