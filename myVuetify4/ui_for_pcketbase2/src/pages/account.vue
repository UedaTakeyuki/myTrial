<template>
  <v-card class="pa-4">
    <!-- トップレベルで定義した変数はそのまま表示できます -->
    <p>name: {{ name }}</p>
    <p>email: {{ email }}</p>
    <p>isValid: {{ isValid }}</p>
  </v-card>  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PocketBase from 'pocketbase'

// 1. PocketBaseのインスタンス化と変数の定義は「関数の外」で行います
const pb = new PocketBase('https://pocketbase.uedasoft.com')

// 2. authStore.model からデータを取得し、refでリアクティブにします
// (モデルが空の場合を考慮して「?.」を付けて安全にアクセスします)
const name = ref(pb.authStore.model?.name || '未設定')
const email = ref(pb.authStore.model?.email || '未設定')
const isValid = ref(pb.authStore.isValid)

onMounted(async () => {
  console.log(`コンポーネントがマウントされました。`)
  console.log('現在の認証情報:', pb.authStore)
  
  // もしマウント時に最新の認証状態をサーバーと同期したい場合は、ここで再読み込みを行います
  if (pb.authStore.isValid) {
    try {
      await pb.collection('users').authRefresh()
      // 同期後の最新データを反映
      name.value = pb.authStore.model?.name
      email.value = pb.authStore.model?.email
      isValid.value = pb.authStore.isValid
    } catch (err) {
      console.error('認証の更新に失敗しました:', err)
    }
  }
})
</script>