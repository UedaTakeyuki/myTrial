<template>
  <!-- Google Fonts から美しい筆記体「Great Vibes」を読み込む -->
  <link rel="preconnect" href="https://googleapis.com">
  <link rel="preconnect" href="https://gstatic.com" crossorigin>
  <link href="https://googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet">
  
  <!-- アプリケーションバー -->
  <v-app-bar elevation="0" class="border-b">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="drawer = !drawer" variant="text" color="grey-darken-2"></v-app-bar-nav-icon>
    </template>
    
    <!-- 修正ポイント1：タイトルを英語（My Dashboard等）にして、筆記体クラスを適用 -->
    <v-app-bar-title class="script-font text-grey-darken-3">My Dashboard</v-app-bar-title>
  </v-app-bar>

  <!-- ナビゲーションドロワー -->
  <v-navigation-drawer 
    v-model="drawer" 
    class="custom-drawer"
    :style="{ height: 'max-content' }"
    rounded="xl"
    elevation="6"
    border="0"
  >
    <v-list nav class="pa-3">
      
      <!-- 修正ポイント2：メニューは読みやすい普通のフォント（日本語）に戻しました -->
      <v-list-item 
        prepend-icon="mdi-home-variant-outline" 
        title="ホーム" 
        value="home"
        class="mb-1 rounded-lg custom-list-item"
        color="primary"
      ></v-list-item>

      <v-list-item 
        prepend-icon="mdi-cog-outline" 
        title="設定" 
        value="settings"
        class="rounded-lg custom-list-item"
        color="primary"
      ></v-list-item>

    </v-list>
  </v-navigation-drawer>

</template>

<script setup>
import { ref } from 'vue'

// ドロワーの開閉状態を管理するリアクティブな変数（初期値は true で開いた状態）
const drawer = ref(true)
</script>

<style scoped>
/* 
  修正ポイント2: 
  Vuetifyが画面下に引き伸ばそうとする「bottom」の計算をCSSで完全に解除します。
  さらに内側のコンテンツ領域（v-navigation-drawer__content）も高さ自動にします。
*/
:deep(.custom-drawer) {
  bottom: auto !important;
}

:deep(.custom-drawer .v-navigation-drawer__content) {
  height: max-content !important;
}

/* メニュー項目：見やすくスッキリしたモダンフォント */
.custom-list-item {
  transition: all 0.2s ease-in-out !important;
  font-weight: 500 !important;
  font-size: 0.9rem !important;
}

.custom-list-item:hover {
  transform: translateX(4px);
}

/* 
  修正ポイント3：
  ヘッダーのタイトルだけに筆記体を適用します。
  ロゴのように見せるため、少し大きめのサイズ（2rem）に調整しています。
*/
.script-font {
  font-family: 'Great Vibes', cursive !important;
  font-size: 2rem !important;
  letter-spacing: 1px !important;
}
</style>