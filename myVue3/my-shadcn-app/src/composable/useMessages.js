import { ref, onUnmounted } from 'vue'
import pb from '@/lib/pocketbase'
import md5 from '@/lib/md5'

export function useMessages() {
  const records = ref([])
  const avatarUrls = ref({})
  const isSending = ref(false)
  const currentUserId = pb.authStore.record?.id || ''

  // アバターURLの読み込み
  const loadSingleAvatarUrl = (user) => {
    if (user?.email && !avatarUrls.value[user.id]) {
      const hash = md5(user.email)
      avatarUrls.value[user.id] = `https://gravatar.com{hash}?d=identicon&s=150`
    }
  }

  // メッセージ一括取得
  const fetchMessages = async (targetId) => {
    if (!targetId) return

    // PocketBaseの複数選択Relationを正しく検索するためのドットid + ?= 構文
    const filterQuery = `(user_from = "${currentUserId}" && user_to.id ?= "${targetId}") || (user_from = "${targetId}" && user_to.id ?= "${currentUserId}")`
    console.log("【APIクエリ】フィルター:", filterQuery)

    try {
      const data = await pb.collection('messages').getFullList({
        filter: filterQuery,
        sort: '-created',
        expand: 'user_from,user_to',
        requestKey: null
      })
      
      records.value = data.reverse()
      
      for (const msg of records.value) {
        loadSingleAvatarUrl(msg.expand?.user_from)
        loadSingleAvatarUrl(msg.expand?.user_to)
      }
      console.log("【APIクエリ成功】取得件数:", records.value.length)
    } catch (error) {
      console.error("【APIクエリ失敗】詳細:", error)
    }
  }

  // リアルタイム同期
  const subscribeMessages = async (targetId, onNewMessageReceived) => {
    if (!targetId) return

    await pb.collection('messages').unsubscribe('*')

    await pb.collection('messages').subscribe('*', async ({ action, record }) => {
      if (action === 'create') {
        // どんなデータ構造で届いても文字列化して確実にIDを検知する
        const toUsersString = JSON.stringify(record.user_to) || String(record.user_to) || ''
        const hasMyId = toUsersString.includes(currentUserId)
        const hasTargetId = toUsersString.includes(targetId)

        const isMyChat = (record.user_from === currentUserId && hasTargetId) || 
                         (record.user_from === targetId && hasMyId)
        
        if (!isMyChat) return 

        try {
          await new Promise(resolve => setTimeout(resolve, 250))

          const freshRecord = await pb.collection('messages').getOne(record.id, {
            expand: 'user_from,user_to',
            requestKey: null
          })

          loadSingleAvatarUrl(freshRecord.expand?.user_from)
          
          if (!records.value.some(r => r.id === freshRecord.id)) {
            records.value.push(freshRecord)
          }

          if (onNewMessageReceived) onNewMessageReceived()
        } catch (error) {
          console.error("【リアルタイム同期エラー】:", error)
        }
      }
      
      if (action === 'delete') {
        records.value = records.value.filter(r => r.id !== record.id)
      }
    })
  }

  // メッセージ送信
  const sendMessage = async ({ text = '', file = null, targetId = '' }) => {
    isSending.value = true
    try {
      const formData = new FormData()
      
      if (text && text.trim() !== '') {
        formData.append('message', text)
      }
      
      formData.append('user_from', currentUserId) 

      if (targetId) {
        // Multiple（複数選択）に配列として正しく認識させるための FormData 連続 append
        const targets = Array.isArray(targetId) ? targetId : [targetId]
        targets.forEach(id => {
          formData.append('user_to', id)
        })
      }
      
      if (file) {
        formData.append('file', file)
      }
      
      const result = await pb.collection('messages').create(formData)
      console.log("【送信成功】PocketBase保存完了:", result)
      return true
    } catch (error) {
      console.error('【送信失敗】詳細:', error)
      return false
    } finally {
      isSending.value = false
    }
  }
  
  const unsubscribeMessages = () => {
    pb.collection('messages').unsubscribe('*')
  }
  
  onUnmounted(() => {
    unsubscribeMessages()
  })

  return {
    records,
    avatarUrls,
    isSending,
    currentUserId,
    fetchMessages,
    subscribeMessages,
    sendMessage
  }
}
