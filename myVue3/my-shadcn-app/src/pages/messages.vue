<!-- views/messages.vue -->
<template>
  <div class="flex flex-col h-screen max-w-md mx-auto bg-background relative overflow-hidden">
    
    <!-- ヘッダーエリア -->
    <div class="p-4 border-b shrink-0 bg-background/90 backdrop-blur z-20">
      <h2 class="text-xl font-bold tracking-tight">メッセージ履歴</h2>
    </div>

    <!-- メッセージ一覧エリア -->
    <div ref="scrollContainer" class="flex-1 overflow-y-auto p-4 space-y-4 pb-8 flex flex-col">
      <Card v-if="records.length === 0" class="p-6 text-center text-muted-foreground my-auto">
        メッセージはありません
      </Card>

      <template v-else>
        <MessageItem 
          v-for="msg in records" 
          :key="msg.id"
          :msg="msg"
          :current-user-id="currentUserId"
          :avatar-url="avatarUrls[msg.expand?.user_from?.id]"
        />
      </template>
    </div>

    <!-- 送信フォームエリアをコンポーネント化 -->
    <MessageForm :is-sending="isSending" @send="handleSend" />

  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { Card } from '@/components/ui/card'
import MessageItem from '@/components/MessageItem.vue'
import MessageForm from '@/components/MessageForm.vue' // 💡 追加
import { useMessages } from '@/lib/useMessages'

const scrollContainer = ref(null)
const { 
  records, 
  avatarUrls, 
  isSending, 
  currentUserId, 
  fetchMessages, 
  subscribeMessages,
  sendMessage
} = useMessages()

const audio = new Audio(`${window.location.origin}/dragon-studio-new-notification-3-398649.mp3`)
audio.volume = 0.5

const scrollToBottom = async () => {
  await nextTick()
  scrollContainer.value?.scrollTo({
    top: scrollContainer.value.scrollHeight,
    behavior: 'smooth'
  })
}

// フォームからデータを受け取って送信処理を行う
const handleSend = async ({ text, file }) => {
  let targetId = ''
  if (records.value && records.value.length > 0) {
    const oppositeMessage = records.value.find(r => r.user_from !== currentUserId)
    if (oppositeMessage) {
      targetId = oppositeMessage.user_from
    } else {
      const lastMsg = records.value[records.value.length - 1]
      if (lastMsg && lastMsg.user_to) {
        targetId = Array.isArray(lastMsg.user_to) ? lastMsg.user_to[0] : lastMsg.user_to
      }
    }
  }

  await sendMessage(text, file, targetId)
}

onMounted(async () => {
  try {
    await fetchMessages()
    await nextTick()
    await scrollToBottom()

    await new Promise(resolve => setTimeout(resolve, 100))

    await subscribeMessages(async () => {
      await nextTick()
      if (records.value && records.value.length > 0) {
        const lastMessage = records.value[records.value.length - 1]
        const myId = currentUserId?.value !== undefined ? currentUserId.value : currentUserId
        
        if (!myId || lastMessage.user_from !== myId) {
          audio.currentTime = 0
          audio.play().catch(err => console.log("音声再生ブロック:", err))
        }
      }
      scrollToBottom()
    })
  } catch (error) {
    console.error("初期化失敗:", error)
  }
})
</script>
