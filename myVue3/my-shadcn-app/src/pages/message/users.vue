<!-- /src/pages/message/users.vue -->
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router/auto'
import { useInvites } from '@/composables/message/useInvites'
import InviteManager from '@/components/message/InviteManager.vue' // 💡 子コンポーネントをインポート

const router = useRouter()

const {
  currentUser,
  activeChats,
  myCreatedCode,
  isProcessing,
  fetchInitialData,
  generateInviteCode,
  verifyInviteCode
} = useInvites()

// 子コンポーネントからコード認証が走ったときの処理
const handleVerifyCode = async (code, callback) => {
  const success = await verifyInviteCode(code)
  if (success && callback) {
    callback() // 成功したら子コンポーネント側の入力欄をクリアさせる
  }
}

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
  <div class="max-w-xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">チャット</h1>

    <!-- 🏆 エリアC: チャット可能なユーザー一覧 -->
    <div class="space-y-3">
      <h2 class="font-bold text-gray-800 dark:text-gray-200 text-sm flex items-center gap-1">
        <span>💬</span> つながっているチャット一覧
      </h2>
      
      <div v-if="activeChats.length > 0" class="border rounded-lg divide-y bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700">
        <div 
          v-for="chat in activeChats" 
          :key="chat.relationId" 
          class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
        >
          <div>
            <p class="font-bold text-gray-800 dark:text-gray-200">
              {{ chat.partner?.name || chat.partner?.username || '名前未設定' }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500">{{ chat.partner?.email }}</p>
          </div>
          <button 
            @click="goToChat(chat.partner?.id)"
            class="px-4 py-2 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-md text-sm font-bold hover:bg-slate-900 dark:hover:bg-white transition"
          >
            チャットを開く
          </button>
        </div>
      </div>
      
      <div v-else class="text-center text-gray-400 dark:text-gray-500 py-8 border rounded-lg border-dashed text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        まだつながっているチャット相手はいません。<br>下の「新しいチャットを追加」から登録してください。
      </div>
    </div>

    <!-- 🛠️ 招待・管理コンポーネント（切り出し後） -->
    <InviteManager 
      :my-created-code="myCreatedCode"
      :is-processing="isProcessing"
      @generate-code="generateInviteCode"
      @verify-code="handleVerifyCode"
    />

  </div>
</template>
