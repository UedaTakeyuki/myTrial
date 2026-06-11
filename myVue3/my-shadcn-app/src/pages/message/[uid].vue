<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router/auto' 
import { Card } from '@/components/ui/card'
import MessageItem from '@/components/message/MessageItem.vue'
import MessageForm from '@/components/message/MessageForm.vue'
import { useMessages } from '@/composable/useMessages'
import pb from '@/lib/pocketbase'

const route = useRoute('/message/[uid]')
// その画面が開かれた時点の相手のIDを取得
const targetId = route.params.uid 

const scrollContainer = ref(null)
const targetUserEmail = ref('読み込み中...') 

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

// フォームから送信データが渡された時の処理
const handleSend = async ({ text, file }) => {
  if (!targetId) {
    console.error("宛先のIDが取得できていないため、送信を中止しました")
    return
  }
  
  // オブジェクト形式で安全に送る
  await sendMessage({
    text: text,
    file: file,
    targetId: targetId
  })
}

onMounted(async () => {
  console.log("【[uid].vue 初期化】チャット相手のID:", targetId)
  console.log("【[uid].vue 初期化】自分のID:", currentUserId)
  


  try {
    // 💡 追加: 相手との承認関係が 'accepted' かをチェックする
    const isFriend = await pb.collection('friends').getFirstListItem(
      `(user_from="${currentUserId}" && user_to="${targetId}" && status="accepted") || (user_from="${targetId}" && user_to="${currentUserId}" && status="accepted")`
    ).catch(() => null)

    // 💡 message/[uid].vue 内のガード処理
    if (!isFriend) {
      alert("このユーザーとはまだチャットの承認が完了していません。")
      router.push('/message/users') // 👈 '/users' から '/message/users' に修正
      return
    }

    // 相手のユーザー情報を直接取得してヘッダーに表示
    if (targetId) {
      const user = await pb.collection('users').getOne(targetId).catch(() => null)
      if (user) {
        targetUserEmail.value = user.email || user.username || 'チャット相手'
      } else {
        targetUserEmail.value = '不明なユーザー'
      }
    }

    // メッセージの取得
    await fetchMessages(targetId)
    
    await nextTick()
    await scrollToBottom()

    // リアルタイム同期の開始
    await subscribeMessages(targetId, async () => {
      await nextTick()
      if (records.value && records.value.length > 0) {
        const lastMessage = records.value[records.value.length - 1]
        if (lastMessage.user_from !== currentUserId) {
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

<template>
  <Card class="flex flex-col h-screen">
    <header class="p-4 border-b font-bold text-lg">
      {{ targetUserEmail }} さんとのチャット
    </header>
    
    <div ref="scrollContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <MessageItem 
        v-for="msg in records" 
        :key="msg.id" 
        :msg="msg" 
        :avatar-urls="avatarUrls"
        :current-user-id="currentUserId"
      />
    </div>

    <footer class="p-4 border-t">
      <MessageForm :is-sending="isSending" @send="handleSend" />
    </footer>
  </Card>
</template>
