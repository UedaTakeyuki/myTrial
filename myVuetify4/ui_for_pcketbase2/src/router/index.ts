/**
 * router/index.ts
 *
 * Manual routes for ./src/pages/*.vue
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
// import Index from '@/pages/index.vue'
import { routes } from 'vue-router/auto-routes' // 自動生成されたルート

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  /*
  routes: [
    {
      path: '/',
      component: Index,
    },
  ],
*/
})

export default router
