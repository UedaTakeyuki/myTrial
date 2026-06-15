// src/composables/message/useNotifications.js
import { ref, onUnmounted } from 'vue'
import pb from '@/lib/pocketbase'

export function useNotifications() {
  const notifications = ref([])
  const currentUser = pb.authStore.record
  let unsubscribeFn = null

  // ⏳ 1. 未読通知の初期取得
  const fetchUnreadNotifications = async () => {
    if (!currentUser) return
    try {
      notifications.value = await pb.collection('notifications').getFullList({
        filter: `user_to = '${currentUser.id}' && is_read = false`,
        sort: '-created',
      })
    } catch (error) {
      console.error('通知データの初期取得に失敗しました:', error)
    }
  }

  // 🔥 2. リアルタイム監視の開始（ガード処理用の関数を外部から受け取れるようにする）
  const subscribeNotifications = async (shouldIgnoreFn = null) => {
    if (!currentUser) return
    if (unsubscribeFn) await unsubscribeFn() // 重複購読防止

    unsubscribeFn = await pb.collection('notifications').subscribe('*', (e) => {
      const record = e.record
      if (record.user_to !== currentUser.id) return

      if (e.action === 'create' && !record.is_read) {
        // 💡 外部から「今はチカチカさせない」ルール（チャット画面を開いているなど）が渡されていれば適用
        if (shouldIgnoreFn && shouldIgnoreFn(record)) {
          return
        }
        notifications.value.unshift(record)
      } 
      else if (e.action === 'update' && record.is_read) {
        notifications.value = notifications.value.filter(n => n.id !== record.id)
      } 
      else if (e.action === 'delete') {
        notifications.value = notifications.value.filter(n => n.id !== record.id)
      }
    })
  }

  // 🗑️ 3. 特定の相手からの新着メッセージ通知をまとめて既読にする（チャット画面等で利用）
  const markChatNotificationsAsRead = async (senderId) => {
    if (!currentUser || !senderId) return
    try {
      const unreadNotification = await pb.collection('notifications').getFirstListItem(
        `user_to = '${currentUser.id}' && user_from = '${senderId}' && type = 'new_message' && is_read = false`
      ).catch(() => null)

      if (unreadNotification && unreadNotification.id) {
        await pb.collection('notifications').update(unreadNotification.id, { is_read: true })
      }
    } catch (error) {
      console.warn("⚠️ 通知の既読更新をスキップしました:", error)
    }
  }

  // ➕ 4. 新しい通知の作成・更新（メッセージ送信側などから呼び出す汎用関数）
  const sendNewMessageNotification = async (targetId) => {
    if (!currentUser || !targetId) return
    try {
      const existing = await pb.collection('notifications').getFirstListItem(
        `user_to = '${targetId}' && user_from = '${currentUser.id}' && type = 'new_message' && is_read = false`
      ).catch(() => null)

      if (existing) {
        await pb.collection('notifications').update(existing.id, {
          title: '新着メッセージがあります',
          text: '新しいメッセージが届いています。',
        })
      } else {
        await pb.collection('notifications').create({
          user_to: targetId,
          user_from: currentUser.id,
          type: 'new_message',
          title: '新着メッセージ',
          text: `新着メッセージが届きました。`,
          is_read: false,
          link_url: `/message/${currentUser.id}`
        })
      }
    } catch (error) {
      console.error('通知の作成/更新に失敗しました:', error)
    }
  }

  const unsubscribeNotifications = () => {
    if (unsubscribeFn) {
      pb.collection('notifications').unsubscribe('*')
    }
  }

  return {
    notifications,
    fetchUnreadNotifications,
    subscribeNotifications,
    markChatNotificationsAsRead,
    sendNewMessageNotification,
    unsubscribeNotifications
  }
}
