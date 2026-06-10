<!-- views/messages.vue -->
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
      <!-- 💡 選択された画像のプレビュー表示 -->
      <div v-if="imagePreview" class="mb-2 relative inline-block">
        <img :src="imagePreview" class="h-14 w-14 object-cover rounded-md border" />
        <button type="button" @click="clearImage" class="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-sm hover:opacity-90">
          <svg xmlns="http://w3.org" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSend" class="flex gap-2 items-center">
        <!-- 💡 隠しファイルインプット -->
        <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="onFileChange" />
        
        <Button type="button" size="icon" variant="outline" class="rounded-full h-10 w-10 shrink-0" @click="triggerFileInput" :disabled="isSending">
          <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
          </svg>
        </Button>

        <Input v-model="newMessage" placeholder="メッセージを入力..." class="flex-1 rounded-full px-4 h-10" :disabled="isSending" />
        
        <!-- 💡 修正：:disabled から古い変数名の条件を完全に排除し、送信中かどうか、およびテキストか画像があるかだけのクリーンな条件に統一 -->
        <Button type="submit" size="icon" class="rounded-full h-10 w-10 shrink-0" :disabled="(!newMessage.trim() && !selectedFile) || isSending">
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
const scrollContainer = ref(null)

const fileInput = ref(null)
const selectedFile = ref(null)
const imagePreview = ref('')

const { 
  records, 
  avatarUrls, 
  isSending, 
  currentUserId, 
  fetchMessages, 
  subscribeMessages,
  sendMessage
} = useMessages()

// 通知音用のインスタンスを最上部で保持
const audio = new Audio(`${window.location.origin}/dragon-studio-new-notification-3-398649.mp3`)
audio.volume = 0.5

const scrollToBottom = async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const onFileChange = (e) => {
  const files = e.target.files
  if (files && files.length > 0) {
    const targetFile = files[0]
    selectedFile.value = targetFile
    imagePreview.value = URL.createObjectURL(targetFile)
    console.log("【検証】画像選択成功。ファイルオブジェクト:", selectedFile.value)
  }
}

const clearImage = () => {
  selectedFile.value = null
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 💡 自動宛先割り出し機能付きのクリーンな handleSend
const handleSend = async () => {
  if (!newMessage.value.trim() && !selectedFile.value) return

  let targetId = ''
  if (records.value && records.value.length > 0) {
    // 自分以外の送信者IDを検索
    const oppositeMessage = records.value.find(r => r.user_from !== currentUserId)
    if (oppositeMessage) {
      targetId = oppositeMessage.user_from
    } else {
      // 相手の発言がまだ無い場合は直近メッセージのuser_toを流用
      const lastMsg = records.value[records.value.length - 1]
      if (lastMsg && lastMsg.user_to) {
        if (Array.isArray(lastMsg.user_to) && lastMsg.user_to.length > 0) {
          targetId = lastMsg.user_to[0]
        } else if (typeof lastMsg.user_to === 'string') {
          targetId = lastMsg.user_to
        }
      }
    }
  }

  console.log("【送信検証】確定した宛先ID:", targetId)

  // ⭕ targetId を安全に引数に渡して実行
  const success = await sendMessage(newMessage.value, selectedFile.value, targetId)
  
  if (success) {
    newMessage.value = ''
    clearImage()
  }
}

onMounted(async () => {
  try {
    console.log("【初期化】1. 過去ログの取得を開始します...")
    await fetchMessages()
    
    console.log("【初期化】2. 画面の描画完了を待ちます...")
    await nextTick()
    await scrollToBottom()

    await new Promise(resolve => setTimeout(resolve, 100))

    console.log("【初期化】3. リアルタイム同期（SSE）を開始します")
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
    
    console.log("【初期化】すべての接続設定が正常に完了しました")
  } catch (error) {
    console.error("初期化失敗:", error)
  }
})
</script>
