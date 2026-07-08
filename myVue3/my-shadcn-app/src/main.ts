import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 👈 追加
import './assets/index.css'
import { createHead } from '@unhead/vue/client' // ★インポート
import { createI18n } from 'vue-i18n'

const head = createHead() // ★ヘッド管理の初期化

// i18n インスタンスの作成
const i18n = createI18n({
  locale: 'ja', // デフォルト言語
  fallbackLocale: 'en', // 該当する言語がない場合の代替言語
  messages: {}, // global messages object
})

createApp(App).use(router).use(head).use(i18n).mount('#app')
