// composables/useMessages.js
import { ref } from 'vue'
import pb from '@/lib/pocketbase'

export function useMessages() {
  const records = ref([])
  const avatarUrls = ref({})
  const isSending = ref(false)
  const currentUserId = pb.authStore.record?.id || ''

  // MD5ハッシュ生成（内部ヘルパー）
  const getMd5Hash = async (string) => {
    const msgUint8 = new TextEncoder().encode(string.trim().toLowerCase())
    const hashBuffer = await crypto.subtle.digest('SHA-256', hashBuffer) // SHA-256で代用されているためそのまま維持
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // アバターURLの読み込み
  const loadAvatarUrls = async (messages) => {
    for (const msg of messages) {
      const user = msg.expand?.user_from
      if (user?.email && !avatarUrls.value[user.id]) {
        const hash = await getMd5Hash(user.email)
        avatarUrls.value[user.id] = `https://gravatar.com{hash}?d=identicon&s=150`
      }
    }
  }

  // メッセージ取得
  const fetchMessages = async () => {
    const data = await pb.collection('messages').getFullList({
      sort: '-created',
      expand: 'user_from,user_to',
      requestKey: null
    })
    records.value = data.reverse()
    await loadAvatarUrls(records.value)
  }

  // メッセージ送信
  const sendMessage = async (text) => {
    if (!text.trim() || isSending.value) return false

    isSending.value = true
    try {
      const lastMessage = records.value[records.value.length - 1]
      const targetUserId = lastMessage?.user_from !== currentUserId ? lastMessage?.user_from : currentUserId

      await pb.collection('messages').create({
        message: text,
        user_from: currentUserId,
        user_to: [targetUserId]
      })

      await fetchMessages()
      return true
    } catch (error) {
      console.error("送信失敗:", error)
      return false
    } finally {
      isSending.value = false
    }
  }

  return {
    records,
    avatarUrls,
    isSending,
    currentUserId,
    fetchMessages,
    sendMessage
  }
}
