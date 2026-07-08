// composables/useInvites.js
import { ref } from 'vue'
import pb from '@/lib/pocketbase'

export function useInvites() {
  const currentUser = pb.authStore.record
  const activeChats = ref([])     // 承認済みのチャット可能リスト
  const myCreatedCode = ref(null) // 自分が今発行している4桁コード
  const isProcessing = ref(false) // ボタンの連打防止用フラグ

  // 🔄 1. データの取得・整理
  const fetchInitialData = async () => {
    if (!currentUser) return
    try {
      // 承認済みのチャット可能リストを取得
      const friendsData = await pb.collection('friends').getFullList({
        filter: `(user_from = '${currentUser.id}' || user_to = '${currentUser.id}') && status = 'accepted'`,
        expand: 'user_from,user_to',
        requestKey: null
      })

      activeChats.value = friendsData.map(rel => {
        const partner = rel.user_from === currentUser.id ? rel.expand.user_to : rel.expand.user_from
        return { relationId: rel.id, partner }
      })

      // 自分がすでに発行している有効な招待コードがあれば1件取得
      const existingCode = await pb.collection('invites').getFirstListItem(`user_from = '${currentUser.id}'`).catch(() => null)
      myCreatedCode.value = existingCode ? existingCode.code : null

    } catch (error) {
      console.error("データの取得に失敗しました:", error)
    }
  }

  // 🎰 2. 4桁のランダムな数字コードを発行する
  const generateInviteCode = async () => {
    if (isProcessing.value) return
    isProcessing.value = true
    try {
      const existing = await pb.collection('invites').getFirstListItem(`user_from = '${currentUser.id}'`).catch(() => null)
      if (existing) {
        await pb.collection('invites').delete(existing.id)
      }

      const randomCode = Math.floor(1000 + Math.random() * 9000).toString()

      await pb.collection('invites').create({
        code: randomCode,
        user_from: currentUser.id
      })

      myCreatedCode.value = randomCode
      alert(`招待コード「${randomCode}」を発行しました。相手に伝えてください。`)
    } catch (error) {
      console.error("招待コードの発行に失敗しました:", error)
      alert("コードの発行に失敗しました")
    } finally {
      isProcessing.value = false
    }
  }

  // 🔑 3. 相手の招待コードを入力してチャットを成立させる
  const verifyInviteCode = async (code) => {
    if (!code || code.length !== 4) {
      alert("招待コードは4桁の数字で入力してください")
      return false
    }
    if (isProcessing.value) return false
    isProcessing.value = true

    try {
      const inviteRecord = await pb.collection('invites').getFirstListItem(`code = '${code}'`, {
        expand: 'user_from'
      })

      if (inviteRecord.user_from === currentUser.id) {
        alert("自分の発行したコードを入力することはできません")
        return false
      }

      const targetUserId = inviteRecord.user_from

      const alreadyExists = await pb.collection('friends').getFirstListItem(
        `(user_from = '${currentUser.id}' && user_to = '${targetUserId}') || (user_from = '${targetUserId}' && user_to = '${currentUser.id}')`
      ).catch(() => null)

      if (alreadyExists) {
        alert("このユーザーとは既にチャットが繋がっています")
        await pb.collection('invites').delete(inviteRecord.id).catch(() => null)
        return true
      }

      // チャットを即時成立させる
      const friendRecord = await pb.collection('friends').create({
        user_from: targetUserId,
        user_to: currentUser.id,
        status: 'accepted'
      })

      // 🔥【追加】コード発行者（targetUserId）に向けて通知レコードを作成する
      // 🔥 修正：通知作成を完全に独立した try-catch で囲み、絶対に全体のエラーにしない
      try {
        await pb.collection('notifications').create({
          user_to: targetUserId,                     // 通知を受け取る人（コードを発行した人）
          user_from: currentUser.id,                 // 通知を送った人（今コードを入力した自分）
          type: 'friend_request',                   // 汎用タイプ名
          title: 'チャットが成立しました！',
          text: `${currentUser.email || '新しい友達'} さんがあなたの招待コードを登録しました。`,
          is_read: false,
          link_url: `/messages`,                    // 遷移先（チャット一覧画面など）
          source_id: friendRecord.id                // 関連する friends レコードの ID
        })
      } catch (notificationError){
        // 万が一、PocketBaseのAPIルールなどで通知作成が失敗しても、コンソールにログを出すだけでスルーする
        console.warn("⚠️ 通知の作成のみ失敗しました（APIルール等を確認してください）:", notificationError)
      }

      // 使用済みのコードを削除
      await pb.collection('invites').delete(inviteRecord.id)

      alert(`チャットが成立しました！\n相手: ${inviteRecord.expand?.user_from?.email || 'ユーザー'}`)
      await fetchInitialData() // データを再読込
      return true

    } catch (error) {
      console.error("コード照合エラー:", error)
      alert("無効な招待コードか、すでに使用済みのコードです。")
      return false
    } finally {
      isProcessing.value = false
    }
  }

  return {
    currentUser,
    activeChats,
    myCreatedCode,
    isProcessing,
    fetchInitialData,
    generateInviteCode,
    verifyInviteCode
  }
}
