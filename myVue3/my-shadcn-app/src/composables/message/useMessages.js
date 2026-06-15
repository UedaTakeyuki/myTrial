import { ref, onUnmounted } from 'vue'
import pb from '@/lib/pocketbase'
import md5 from '@/lib/md5'
import { useNotifications } from '@/composables/message/useNotifications' // 💡 追加

export function useMessages() {
  const records = ref([])
  const avatarUrls = ref({})
  const isSending = ref(false)
  const currentUserId = pb.authStore.record?.id || ''
  const { markChatNotificationsAsRead, sendNewMessageNotification } = useNotifications() // 💡 追加

  // アバターURLの読み込み
  const loadSingleAvatarUrl = (user) => {
    if (user?.email && !avatarUrls.value[user.id]) {
      const hash = md5(user.email)
      avatarUrls.value[user.id] = `https://gravatar.com{hash}?d=identicon&s=150`
    }
  }

  // 🔥【追加】溜まっている未読メッセージを既読（is_read = true）にする関数
  const markMessagesAsRead = async (targetId) => {
    if (!targetId) return
    try {
      // 相手から自分への未読メッセージをすべて取得
      const unread = await pb.collection('messages').getFullList({
        filter: `user_from = "${targetId}" && user_to.id ?= "${currentUserId}" && is_read = false`
      })

      // メッセージをすべて既読に更新
      if (unread.length > 0) {
        await Promise.all(
          unread.map(msg => pb.collection('messages').update(msg.id, { is_read: true }))
        )
      }

      // 🔥 修正：通知の既読化ロジックをごっそり削り、新しいComposableの関数を1行呼ぶだけ！
      await markChatNotificationsAsRead(targetId)

    } catch (error) {
      // 💡 ここでエラーが起きても全体を落とさないよう警告にとどめる
      console.warn("⚠️ 既読処理の途中でスキップされました（通知レコードが既に無いなど）:", error)
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

      // 🔥【追加】メッセージを読み込んだら、既読処理を実行
      await markMessagesAsRead(targetId)

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

          // 🔥【追加】自分が今このチャット画面を開いている状態で「相手から」メッセージが届いたなら、即座にメッセージと通知を既読にする
          if (freshRecord.user_from === targetId) {
            await pb.collection('messages').update(freshRecord.id, { is_read: true })
            
            // 鐘の通知も既読にしてチカチカさせない
            const unreadNotification = await pb.collection('notifications').getFirstListItem(
              `user_to = '${currentUserId}' && user_from = '${targetId}' && type = 'new_message' && is_read = false`
            ).catch(() => null)
            if (unreadNotification) {
              await pb.collection('notifications').update(unreadNotification.id, { is_read: true })
            }
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

      // 🔥 修正：送信時の通知レコード作成・更新の長文コードも削り、1行呼ぶだけ！
      await sendNewMessageNotification(targetId)
      
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
    sendMessage,
    markMessagesAsRead // 外部からも叩けるようにエクスポート
  }
}
