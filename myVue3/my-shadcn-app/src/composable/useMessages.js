// composables/useMessages.js
import { ref, onUnmounted } from 'vue'
import pb from '@/lib/pocketbase'
import md5 from '@/lib/md5'

export function useMessages() {
  const records = ref([])
  const avatarUrls = ref({})
  const isSending = ref(false)
  const currentUserId = pb.authStore.record?.id || ''

  // アバターURLの読み込み（単一ユーザー用）
  const loadSingleAvatarUrl = (user) => {
    if (user?.email && !avatarUrls.value[user.id]) {
      // 💡 同期型の自前 md5 関数を使うため、await が不要になり処理も高速化！
      const hash = md5(user.email)
      avatarUrls.value[user.id] = `https://gravatar.com/avatar/${hash}?d=identicon&s=150`
    }
  }

  // メッセージ一括取得
  const fetchMessages = async () => {
    const data = await pb.collection('messages').getFullList({
      sort: '-created',
      expand: 'user_from,user_to',
      requestKey: null
    })
    records.value = data.reverse()
    
    for (const msg of records.value) {
      loadSingleAvatarUrl(msg.expand?.user_from)
    }
  }

// 💡 useMessages.js 内の subscribeMessages を以下に丸ごと差し替えてください

const subscribeMessages = async (onNewMessageReceived) => {
  // ⚠️ subscribe 自体の多重登録による不具合を防ぐため、一度クリアしてから登録するのが安全です
  await pb.collection('messages').unsubscribe('*')

  await pb.collection('messages').subscribe('*', async ({ action, record }) => {
    if (action === 'create') {
      try {
        console.log("【リアルタイムイベント検知】新着レコードID:", record.id)

        // 💡 対策①: 画像のアップロード完了とDB反映の超わずかな時間差を埋めるため、一瞬待つ
        await new Promise(resolve => setTimeout(resolve, 250));

        // 💡 対策②: requestKey: null を最優先で指定し、PocketBase SDKの「自動キャンセル機能」を完全に無効化する！！
        const freshRecord = await pb.collection('messages').getOne(record.id, {
          expand: 'user_from,user_to',
          requestKey: null // 👈 これが最重要！SDKによる勝手なリクエスト破棄を防ぎます
        })

        console.log("【データ取得成功】新着メッセージを展開しました:", freshRecord)

        // アバターURLの読み込み
        loadSingleAvatarUrl(freshRecord.expand?.user_from)
        
        // 配列の重複追加を防止
        if (!records.value.some(r => r.id === freshRecord.id)) {
          records.value.push(freshRecord)
        }

        // コールバック関数（通知音・スクロールなど）を実行
        if (onNewMessageReceived) onNewMessageReceived()

      } catch (error) {
        // ⚠️ 自動キャンセルが発動していた場合、ここに「autocancelled」というエラーが引っかかります
        console.error("【リアルタイム同期エラー】データ取得に失敗しました:", error);
        
        // 💡 対策③: 万が一キャンセルされた場合のリトライ処理（ここでも requestKey: null を付与）
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const retryRecord = await pb.collection('messages').getOne(record.id, {
            expand: 'user_from,user_to',
            requestKey: null
          });
          loadSingleAvatarUrl(retryRecord.expand?.user_from);
          if (!records.value.some(r => r.id === retryRecord.id)) {
            records.value.push(retryRecord);
          }
          if (onNewMessageReceived) onNewMessageReceived();
          console.log("【リトライ成功】遅延同期が完了しました。");
        } catch (finalError) {
          console.error("【リトライ失敗】新着メッセージの取得が完全に遮断されました:", finalError);
        }
      }
    }
    
    if (action === 'delete') {
      records.value = records.value.filter(r => r.id !== record.id)
    }
  })
}

  // 同期解除
  const unsubscribeMessages = () => {
    pb.collection('messages').unsubscribe('*')
  }

  // 💡 useMessages.js 内の sendMessage を以下に差し替え

  // ⭕ 第3引数の変数名を「targetId」に統一します
  const sendMessage = async (text, file = null, targetId = '') => {
    isSending.value = true
    try {
      // FormDataオブジェクトを作成
      const formData = new FormData()
      
      // テキストが存在すれば追加
      if (text && text.trim() !== '') {
        formData.append('message', text)
      }
      
      // 送信者のユーザーIDを追加（文字列変数）
      formData.append('user_from', currentUserId) 

      // 💡 修正：引数名に合わせて「targetId」を正しく user_to に追加
      if (targetId) {
        // もし配列（複数）で届いた場合も考慮して、文字列として安全に追加
        formData.append('user_to', String(targetId))
      }
      
      // 1枚のクリーンな File オブジェクトとして FormData に結合
      if (file) {
        formData.append('file', file)
      }

      console.log("【API通信直前】PocketBaseにFormDataを送信します。")
      
      // PocketBaseへ送信して作成
      const result = await pb.collection('messages').create(formData)
      console.log("【API通信成功】サーバーに保存完了:", result)
      
      return true
    } catch (error) {
      // ⚠️ ここでアラートを出していたため、内部の変数エラーをそのままポップアップさせてしまっていました
      alert("【PocketBase送信エラー】\n" + (error.message || JSON.stringify(error)))
      console.error('送信エラーの詳細:', error)
      return false
    } finally {
      isSending.value = false
    }
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
