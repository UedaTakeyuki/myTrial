import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 👈 追加
import './assets/index.css'
import { createHead } from '@unhead/vue/client' // ★インポート

const head = createHead() // ★ヘッド管理の初期化

createApp(App).use(router).use(head).mount('#app')
