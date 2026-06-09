<!-- views/ChatView.vue (または元のファイル名) -->
<template>
  <div class="flex flex-col h-screen max-w-md mx-auto bg-background relative overflow-hidden">
    
    <!-- ヘッダーエリア -->
    <div class="p-4 border-b shrink-0 bg-background/90 backdrop-blur z-20">
      <h2 class="text-xl font-bold tracking-tight">メッセージ履歴</h2>
    </div>

    <!-- 💬 メッセージ一覧エリア -->
    <div
      ref="scrollContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4 pb-8 flex flex-col"
    >
      <Card v-if="records.length === 0" class="p-6 text-center text-muted-foreground my-auto">
        メッセージはありません
      </Card>

      <template v-else>
        <!-- 👇 すっきりコンポーネントを呼び出すだけ -->
        <MessageItem 
          v-for="msg in records" 
          :key="msg.id"
          :msg="msg"
          :current-user-id="currentUserId"
          :avatar-url="avatarUrls[msg.expand?.user_from?.id]"
        />
      </template>
    </div>

    <!-- 📥 送信フォームエリア -->
    <div class="p-4 border-t bg-background shrink-0 z-20">
      <form @submit.prevent="handleSend" class="flex gap-2 items-center">
        <Input v-model="newMessage" placeholder="メッセージを入力..." class="flex-1 rounded-full px-4 h-10" :disabled="isSending" />
        <Button type="submit" size="icon" class="rounded-full h-10 w-10 shrink-0" :disabled="!newMessage.trim() || isSending">
          <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </Button>
      </form>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import MessageItem from '@/components/MessageItem.vue'
import { useMessages } from '@/lib/useMessages'

const newMessage = ref('')
// 👇 要素を参照するための ref を定義
const scrollContainer = ref(null)

const { 
  records, 
  avatarUrls, 
  isSending, 
  currentUserId, 
  fetchMessages, 
  subscribeMessages, // 👈 追加
  sendMessage // 👈 これが抜けていないか確認してください！
} = useMessages()

// ⭕ メッセージエリア内だけでスクロールさせるヘルパーに変更
const scrollToBottom = async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

const handleSend = async () => {
  const success = await sendMessage(newMessage.value)
  if (success) {
    newMessage.value = ''
    // 💡 自分の送信時も subscribe 経由で描画されるため、ここでのスクロールは不要（または即時やりたい場合のみ残す）
  }
}

onMounted(async () => {
  try {
    // 1. 過去ログを取得
    await fetchMessages()
    await scrollToBottom()

    // 2. リアルタイム同期を開始（新着メッセージが来たらスクロール）
    await subscribeMessages(() => {
      scrollToBottom()
    })
  } catch (error) {
    console.error("初期化失敗:", error)
  }
})
</script>

