<template>
  <v-footer class="custom-footer bg-grey-darken-4 px-6 py-12 px-md-16 py-md-16 flex-column">
    <v-container class="max-width-container pa-0">
      
      <!-- メイングリッド: 4カラム -->
      <v-row class="mb-12">
        <!-- カラム1: ブランド＆メッセージ -->
        <v-col cols="12" md="4" class="pe-md-10 mb-6 mb-md-0">
          <div class="text-h4 font-weight-black text-white tracking-widest mb-4">
            YOUR LOGO
          </div>
          <p class="text-body-2 text-grey-lighten-1 line-height-relaxed">
            革新的なデザインと最新のテクノロジーを掛け合わせ、デジタル体験を次のステージへ。世界基準のクリエイティブを提供します。
          </p>
          
          <!-- SNSアイコン -->
          <div class="d-flex ga-3 mt-6">
            <v-btn v-for="social in socials" :key="social.icon"
              :icon="social.icon"
              variant="tonal"
              color="white"
              size="small"
              class="social-btn"
              :href="social.link"
              target="_blank"
            />
          </div>
        </v-col>

        <!-- カラム2: リンク集1 -->
        <v-col cols="6" md="2" class="mb-6 mb-md-0">
          <div class="text-subtitle-2 font-weight-bold text-uppercase text-grey-darken-1 tracking-wider mb-4">
            Capabilities
          </div>
          <ul class="footer-links-list">
            <li v-for="link in capabilities" :key="link.text">
              <router-link :to="link.to" class="text-body-2 text-grey-lighten-2 footer-link">
                {{ link.text }}
              </router-link>
            </li>
          </ul>
        </v-col>

        <!-- カラム3: リンク集2 -->
        <v-col cols="6" md="2" class="mb-6 mb-md-0">
          <div class="text-subtitle-2 font-weight-bold text-uppercase text-grey-darken-1 tracking-wider mb-4">
            About
          </div>
          <ul class="footer-links-list">
            <li v-for="link in aboutLinks" :key="link.text">
              <router-link :to="link.to" class="text-body-2 text-grey-lighten-2 footer-link">
                {{ link.text }}
              </router-link>
            </li>
          </ul>
        </v-col>

        <!-- カラム4: ニュースレター（CTA） -->
        <v-col cols="12" md="4">
          <div class="text-subtitle-2 font-weight-bold text-uppercase text-grey-darken-1 tracking-wider mb-4">
            Subscribe
          </div>
          <p class="text-body-2 text-grey-lighten-1 mb-4">
            最新のトレンドやアップデート情報をお届けします。
          </p>
          <v-text-field
            v-model="email"
            label="Email Address"
            variant="outlined"
            color="white"
            bg-color="grey-darken-3"
            density="comfortable"
            hide-details
            class="newsletter-input"
          >
            <template #append-inner>
              <v-btn
                variant="text"
                color="white"
                icon="mdi-arrow-right"
                density="comfortable"
                @click="subscribe"
              />
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <!-- 巨大タイポグラフィ（海外風のダイナミックな演出） -->
      <v-row class="my-6 overflow-hidden d-none d-sm-flex">
        <v-col cols="12" class="pa-0 text-center select-none">
          <h2 class="giant-footer-text text-uppercase font-weight-black text-grey-darken-3">
            Creative Agency
          </h2>
        </v-col>
      </v-row>

      <!-- 最下部エリア: コピーライト & 規約 -->
      <v-divider color="grey-darken-2" class="mb-6" />
      
      <div class="d-flex flex-column flex-sm-row justify-space-between align-center ga-4 text-caption text-grey">
        <div>
          &copy; {{ new Date().getFullYear() }} YOUR COMPANY. All Rights Reserved.
        </div>
        <div class="d-flex ga-6">
          <router-link to="/privacy" class="text-grey footer-sub-link">Privacy Policy</router-link>
          <router-link to="/terms" class="text-grey footer-sub-link">Terms of Service</router-link>
        </div>
      </div>

    </v-container>
  </v-footer>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')

const socials = [
  { icon: 'mdi-twitter', link: '#' },
  { icon: 'mdi-instagram', link: '#' },
  { icon: 'mdi-linkedin', link: '#' },
]

const capabilities = [
  { text: 'Web Design', to: '#' },
  { text: 'Development', to: '#' },
  { text: 'Branding', to: '#' },
  { text: 'Marketing', to: '#' },
]

const aboutLinks = [
  { text: 'Our Studio', to: '#' },
  { text: 'Careers', to: '#' },
  { text: 'Journal', to: '#' },
  { text: 'Contact', to: '#' },
]

const subscribe = () => {
  if (email.value) {
    alert(`Subscribed: ${email.value}`)
    email.value = ''
  }
}
</script>

<style scoped>
/* コンテナの最大幅を設定 */
.max-width-container {
  max-width: 1200px;
  width: 100%;
}

/* リストのリセット */
.footer-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-links-list li {
  margin-bottom: 12px;
}

/* リンクホバーアニメーション */
.footer-link, .footer-sub-link {
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: inline-block;
}
.footer-link:hover {
  color: #fff !important;
  transform: translateX(4px);
}
.footer-sub-link:hover {
  color: #fff !important;
}

/* SNSボタンのホバー */
.social-btn {
  transition: all 0.3s ease;
}
.social-btn:hover {
  background-color: #fff !important;
  color: #000 !important;
  transform: translateY(-4px);
}

/* ニュースレター入力欄の微調整 */
.newsletter-input :deep(.v-field__outline) {
  --v-field-border-opacity: 0.15;
}
.newsletter-input :deep(.v-field--focused .v-field__outline) {
  --v-field-border-opacity: 0.6;
}

/* 海外サイト特有の大胆な背景テキスト */
.giant-footer-text {
  font-size: clamp(3rem, 10vw, 8.5rem);
  line-height: 0.8;
  letter-spacing: -0.03em;
  user-select: none;
  opacity: 0.15;
  transition: opacity 0.5s ease;
}
.custom-footer:hover .giant-footer-text {
  opacity: 0.25;
}

/* その他タイポグラフィ調整 */
.tracking-widest { letter-spacing: 0.15em; }
.tracking-wider { letter-spacing: 0.1em; }
.line-height-relaxed { line-height: 1.75; }
</style>