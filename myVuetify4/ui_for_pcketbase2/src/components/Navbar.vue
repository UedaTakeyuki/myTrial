<template>
  <!-- Google Fonts 読み込み -->
  <link rel="preconnect" href="https://googleapis.com">
  <link rel="preconnect" href="https://gstatic.com" crossorigin>
  <link href="https://googleapis.com/css2?family=Parisienne&display=swap" rel="stylesheet">
  
  <!-- 
    1. 浮遊メニュー（ドロワーの代わり）
    ★重要：v-app-bar の「外」に配置することで、App Bar の横並び強制システムから解放します。
    「id="menu-activator"」という目印（ターゲット）を指定して結びつけます。
  -->
  <v-menu
    v-model="drawer"
    :close-on-content-click="false"
    activator="#menu-activator"
    location="bottom start"
    offset="14"
    transition="slide-y-transition"
  >
    <!-- 海外風ドロワー（中身） -->
    <v-sheet
      class="custom-floating-menu pa-3"
      rounded="xl"
      elevation="6"
      width="256"
    >
      <v-list nav class="pa-0">
        <QRcode class="mb-2">
          <template v-slot:title>
            Scan to get this site.
          </template>
        </QRcode>
        
        <v-list-item
          to="/" exact
          prepend-icon="mdi-home-variant-outline" 
          title="Home" 
          value="home"
          class="mb-1 rounded-lg custom-list-item"
          color="primary"
        ></v-list-item>

        <v-list-item 
          to="/settings"
          prepend-icon="mdi-cog-outline" 
          title="Settings" 
          value="settings"
          class="rounded-lg custom-list-item"
          color="primary"
        ></v-list-item>

        <v-list-item
          to="/account"
          prepend-icon="mdi-account-settings" 
          title="Account" 
          value="Account"
          class="rounded-lg custom-list-item"
          color="primary"
        ></v-list-item>
      </v-list>
    </v-sheet>
  </v-menu>

  <!-- 
    2. アプリケーションバー 
  -->
  <v-app-bar 
    elevation="0" 
    class="modern-app-bar"
    height="64"
  >
    <!-- 左側：メニューボタン -->
    <template v-slot:prepend>
      <!-- ★重要：ここに「id="menu-activator"」を付与して、上のメニューと連動させます -->
      <v-app-bar-nav-icon 
        id="menu-activator"
        variant="text" 
        color="grey-darken-3"
        class="nav-icon-btn"
      ></v-app-bar-nav-icon>
    </template>
    
    <!-- 中央：タイトル -->
    <v-app-bar-title class="script-font text-grey-darken-3">My Dashboard</v-app-bar-title>

    <!-- 右側：アクションアイコン -->
    <template v-slot:append>
      <v-btn icon="mdi-magnify" variant="text" color="grey-darken-2" class="mr-1"></v-btn>
      <v-btn icon="mdi-bell-outline" variant="text" color="grey-darken-2" class="mr-2"></v-btn>
      <v-avatar color="grey-lighten-3" size="36" class="cursor-pointer">
        <v-icon color="grey-darken-1">mdi-account</v-icon>
      </v-avatar>
    </template>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'
import { QRcode } from 'qrcode-of-this-site3'

// 初期状態でメニューを開いておく場合は true、閉じておくなら false
const drawer = ref(true)
</script>

<style scoped>
/* フローティング App Bar のスタイル */
.modern-app-bar {
  margin: 12px 16px 0 16px !important;
  width: calc(100% - 32px) !important;
  border-radius: 24px !important;
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03) !important;
  left: 0 !important;
  right: 0 !important;
}

/* メニューボタン */
.nav-icon-btn {
  border-radius: 12px !important;
}

/* 新しい浮遊型ドロワー（メニュー）のベース */
.custom-floating-menu {
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

/* メニュー項目 */
.custom-list-item {
  transition: all 0.2s ease-in-out !important;
  font-weight: 500 !important;
  font-size: 0.9rem !important;
}

.custom-list-item:hover {
  transform: translateX(4px);
}

/* ヘッダータイトル */
.script-font {
  font-family: 'Parisienne', cursive !important;
  font-size: 1.6rem !important;
  letter-spacing: 1px !important;
}
</style>
