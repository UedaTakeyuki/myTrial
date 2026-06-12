<!-- /src/pages/message/users.vue -->
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router/auto'
import { useInvites } from '@/composables/message/useInvites' // 💡 追加

const router = useRouter()
const inputCode = ref('')

// Composable から状態と関数を引っこ抜く
const {
  currentUser,
  activeChats,
  myCreatedCode,
  isProcessing,
  fetchInitialData,
  generateInviteCode,
  verifyInviteCode
} = useInvites()

// コード認証ボタンを押したときの処理
const handleVerify = async () => {
  const success = await verifyInviteCode(inputCode.value.trim())
  if (success) {
    inputCode.value = '' // 成功したら入力欄をクリア
  }
}

// チャット画面へ移動
const goToChat = (targetUserId) => {
  router.push(`/message/${targetUserId}`)
}

onMounted(() => {
  if (!currentUser) {
    router.push('/login')
    return
  }
  fetchInitialData()
})
</script>

<template>
  <div class="max-w-xl mx-auto p-6 space-y-8">
    <h1 class="text-2xl font-bold">チャット管理 (招待コード方式)</h1>

    <!-- 📤 エリアA: 招待コードを発行する -->
    <div class="p-5 border rounded-lg bg-indigo-50 border-indigo-200 shadow-sm space-y-4">
      <h2 class="font-bold text-sm text-indigo-900">📤 チャットに相手を招待する</h2>
      <p class="text-xs text-indigo-700 leading-relaxed">
        ボタンを押して4桁の招待コードを発行し、相手に伝えてください。
      </p>
      
      <div class="flex items-center gap-4">
        <button 
          @click="generateInviteCode"
          :disabled="isProcessing"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {{ myCreatedCode ? 'コードを再発行する' : '招待コードを発行する' }}
        </button>

        <div v-if="myCreatedCode" class="flex items-center gap-2 bg-white px-4 py-1.5 border-2 border-indigo-500 rounded-md">
          <span class="text-xs text-indigo-500 font-bold">現在のコード:</span>
          <span class="text-xl font-black tracking-widest text-indigo-900">{{ myCreatedCode }}</span>
        </div>
      </div>
    </div>

    <!-- 📥 エリアB: 招待コードを入力する -->
    <div class="p-5 border rounded-lg bg-green-50 border-green-200 shadow-sm space-y-4">
      <h2 class="font-bold text-sm text-green-900">📥 招待コードを入力して参加する</h2>
      <p class="text-xs text-green-700 leading-relaxed">
        相手から教えてもらった4桁の招待コードを入力すると、すぐにチャットが開始できます。
      </p>
      
      <div class="flex gap-2">
        <input 
          v-model="inputCode"
          type="text" 
          maxlength="4"
          :disabled="isProcessing"
          placeholder="4桁" 
          class="w-32 px-3 py-2 border rounded-md text-center text-lg font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        />
        <button 
          @click="handleVerify"
          :disabled="isProcessing"
          class="px-5 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
        >
          コードを認証
        </button>
      </div>
    </div>

    <!-- 💬 エリアC: チャット可能なユーザー一覧 -->
    <div class="space-y-3">
      <h2 class="font-bold text-gray-800 text-sm">💬 つながっているチャット一覧</h2>
      <div v-if="activeChats.length > 0" class="border rounded-lg divide-y bg-white shadow-sm">
        <div 
          v-for="chat in activeChats" 
          :key="chat.relationId" 
          class="p-4 flex items-center justify-between"
        >
          <div>
            <p class="font-bold text-gray-800">
              {{ chat.partner?.name || chat.partner?.username || '名前未設定' }}
            </p>
            <p class="text-xs text-gray-400">{{ chat.partner?.email }}</p>
          </div>
          <button 
            @click="goToChat(chat.partner?.id)"
            class="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-bold hover:bg-slate-900 transition"
          >
            チャットを開く
          </button>
        </div>
      </div>
      <div v-else class="text-center text-gray-400 py-8 border rounded-lg border-dashed text-sm">
        まだつながっているチャット相手はいません。<br>コードを発行するか、相手のコードを入力してください。
      </div>
    </div>
  </div>
</template>