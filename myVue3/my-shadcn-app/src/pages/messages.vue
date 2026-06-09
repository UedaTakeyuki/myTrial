<template>
  <!-- 画面全体を固定し、縦並びにするコンテナ（はみ出しを防ぐ） -->
  <div class="flex flex-col h-screen max-w-md mx-auto bg-background relative overflow-hidden">
    
    <!-- ヘッダーエリア -->
    <div class="p-4 border-b shrink-0 bg-background/90 backdrop-blur z-20">
      <h2 class="text-xl font-bold tracking-tight">メッセージ履歴</h2>
    </div>

    <!-- 💬 メッセージ一覧エリア（ここだけが独自にスクロールする） -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-8 flex flex-col">
      <!-- メッセージがない場合の表示 -->
      <Card v-if="records.length === 0" class="p-6 text-center text-muted-foreground my-auto">
        メッセージはありません
      </Card>

      <!-- メッセージ一覧 -->
      <template v-else>
        <div 
          v-for="msg in records" 
          :key="msg.id"
          :class="[
            'flex items-end gap-2 max-w-[80%]',
            isMyMessage(msg) ? 'self-end flex-row-reverse' : 'self-start flex-row'
          ]"
        >
          <!-- アバター -->
          <Avatar class="h-8 w-8 border flex-shrink-0">
            <AvatarImage 
              v-if="avatarUrls[msg.expand?.user_from?.id]" 
              :src="avatarUrls[msg.expand?.user_from?.id]" 
              :alt="getUserName(msg)" 
            />
            <AvatarFallback>{{ getAvatarText(msg) }}</AvatarFallback>
          </Avatar>

          <!-- メッセージの吹き出し部分 -->
          <div class="flex flex-col space-y-1">
            <span v-if="!isMyMessage(msg)" class="text-xs text-muted-foreground px-1">
              {{ getUserName(msg) }}
            </span>
            <Card 
              :class="[
                'p-3 text-sm shadow-sm rounded-2xl',
                isMyMessage(msg) 
                  ? 'bg-primary text-primary-foreground rounded-br-none' 
                  : 'bg-muted text-foreground rounded-bl-none'
              ]"
            >
              <p class="whitespace-pre-wrap break-words">{{ msg.message }}</p>
            </Card>

            <!-- 送信時間 -->
            <div 
              :class="[
                'flex items-center gap-1.5 text-[10px] text-muted-foreground px-1',
                isMyMessage(msg) ? 'justify-end' : 'justify-start'
              ]"
            >
              <span>{{ formatTime(msg.created) }}</span>
              <Badge 
                v-if="isMyMessage(msg) && msg.user_to?.length > 1" 
                variant="secondary" 
                class="text-[9px] px-1 py-0 h-4"
              >
                他{{ msg.user_to.length - 1 }}人
              </Badge>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 📥 送信フォームエリア（最下部に必ず残るように固定・高さを確保） -->
    <div class="p-4 border-t bg-background shrink-0 z-20">
      <form @submit.prevent="sendMessage" class="flex gap-2 items-center">
        <Input 
          v-model="newMessage" 
          placeholder="メッセージを入力..." 
          class="flex-1 rounded-full px-4 h-10"
          :disabled="isSending"
        />
        <Button 
          type="submit" 
          size="icon" 
          class="rounded-full h-10 w-10 shrink-0"
          :disabled="!newMessage.trim() || isSending"
        >
          <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </Button>
      </form>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import pb from '@/lib/pocketbase'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
// 👇 shadcn の Input と Button をインポート
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const records = ref([])
const currentUserId = ref(pb.authStore.record?.id || '')

// 👇 送信フォーム用の状態管理
const newMessage = ref('')
const isSending = ref(false)

// 自分が送信したメッセージかどうかを判定
const isMyMessage = (msg) => {
  return msg.user_from === currentUserId.value
}

// アバターに表示する文字（名前の1文字目）を取得
const getAvatarText = (msg) => {
  const user = msg.expand?.user_from || {}
  const name = user.name || user.username || '?'
  return name.charAt(0).toUpperCase()
}

// ユーザー名を取得
const getUserName = (msg) => {
  const user = msg.expand?.user_from
  return user?.name || user?.username || '名無しさん'
}

// 日時フォーマット
const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// メールアドレスからMD5ハッシュを作成（アバター用）
const getMd5Hash = async (string) => {
  const msgUint8 = new TextEncoder().encode(string.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const avatarUrls = ref({})
const loadAvatarUrls = async (messages) => {
  for (const msg of messages) {
    const user = msg.expand?.user_from
    if (user?.email && !avatarUrls.value[user.id]) {
      const hash = await getMd5Hash(user.email)
      avatarUrls.value[user.id] = `https://gravatar.com{hash}?d=identicon&s=150`
    }
  }
}

// 👇 メッセージを新規送信する関数
const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return

  isSending.value = true
  try {
    // 💡 送信先（user_to）の決め方について
    // 今回はデモ用として「直前のメッセージの送信元」か、いなければ自分自身をセットしています
    // 実装に合わせて「選択中のユーザーID」などに書き換えてください
    const lastMessage = records.value[records.value.length - 1]
    const targetUserId = lastMessage?.user_from !== currentUserId.value 
      ? lastMessage?.user_from 
      : currentUserId.value

    const data = {
      message: newMessage.value,
      user_from: currentUserId.value,
      user_to: [targetUserId] // 配列なので[ ]で囲みます
    }

    // PocketBaseにデータを保存
    const createdRecord = await pb.collection('messages').create(data)

    // 画面に新しく送ったメッセージを即座に反映させるために再取得
    await fetchMessages()
    
    // 入力欄をクリア
    newMessage.value = ''
    
    // 画面の一番下までスクロールさせる
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })

  } catch (error) {
    console.error("メッセージの送信に失敗しました:", error)
  } finally {
    isSending.value = false
  }
}

// メッセージ一括取得の処理を共通化
const fetchMessages = async () => {
  records.value = await pb.collection('messages').getFullList({
    sort: '-created',
    expand: 'user_from,user_to',
    requestKey: null
  })
  records.value.reverse()
  await loadAvatarUrls(records.value)
}

onMounted(async () => {
  try {
    await fetchMessages()
  } catch (error) {
    console.error("データ取得失敗:", error)
  }
})
</script>
