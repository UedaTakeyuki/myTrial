<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router/auto'
import pb from '@/lib/pocketbase'

const router = useRouter()
const currentUser = pb.authStore.record

const activeChats = ref([])     // 承認済みのチャット可能リスト
const myCreatedCode = ref(null) // 自分が今発行している4桁コード
const inputCode = ref('')       // 入力された4桁コード

// 🔄 1. データの取得（チャット一覧と、自分が過去に発行した未消去のコード）
const fetchInitialData = async () => {
  try {
    // 承認済みの関係（チャット可能な相手）を取得
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
    if (existingCode) {
      myCreatedCode.value = existingCode.code
    } else {
      myCreatedCode.value = null
    }

  } catch (error) {
    console.error("データの取得に失敗しました:", error)
  }
}

// 🎰 2. 4桁のランダムな数字コードを発行する
const generateInviteCode = async () => {
  try {
    // すでに発行済みなら一旦削除する（古いコードの破棄）
    const existing = await pb.collection('invites').getFirstListItem(`user_from = '${currentUser.id}'`).catch(() => null)
    if (existing) {
      await pb.collection('invites').delete(existing.id)
    }

    // 4桁のランダムな数字を生成（例: 0123 ~ 9999）
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString()

    // PocketBaseに保存
    await pb.collection('invites').create({
      code: randomCode,
      user_from: currentUser.id
    })

    myCreatedCode.value = randomCode
    alert(`招待コード「${randomCode}」を発行しました。相手に伝えてください。`)
  } catch (error) {
    console.error("招待コードの発行に失敗しました:", error)
    alert("コードの発行に失敗しました")
  }
}

// 🔑 3. 相手の招待コードを入力してチャットを成立させる（デバッグ強化版）
const handleVerifyCode = async () => {
  const code = inputCode.value.trim()
  if (code.length !== 4) {
    alert("招待コードは4桁の数字で入力してください")
    return
  }

  try {
    console.log(`【コード照合開始】コード: ${code} を検索中...`)
    
    // 💡 クエリ構文もシングルクォーテーションで安全に囲んでいます
    const inviteRecord = await pb.collection('invites').getFirstListItem(`code = '${code}'`, {
      expand: 'user_from'
    })

    console.log("【コード発見】招待レコード:", inviteRecord)

    if (inviteRecord.user_from === currentUser.id) {
      alert("自分の発行したコードを入力することはできません")
      return
    }

    const targetUserId = inviteRecord.user_from

    const alreadyExists = await pb.collection('friends').getFirstListItem(
      `(user_from = '${currentUser.id}' && user_to = '${targetUserId}') || (user_from = '${targetUserId}' && user_to = '${currentUser.id}')`
    ).catch(() => null)

    if (alreadyExists) {
      alert("このユーザーとは既にチャットが繋がっています")
      await pb.collection('invites').delete(inviteRecord.id).catch(() => null)
      inputCode.value = ''
      return
    }

    await pb.collection('friends').create({
      user_from: targetUserId,
      user_to: currentUser.id,
      status: 'accepted'
    })

    await pb.collection('invites').delete(inviteRecord.id)

    alert(`チャットが成立しました！\n相手: ${inviteRecord.expand?.user_from?.email || 'ユーザー'}`)
    inputCode.value = ''
    await fetchInitialData()

  } catch (error) {
    // 💡 エラーの原因がAPIルール(400/403)か、本当に存在しない(404)かをログに出します
    console.error("【コード照合エラー詳細】:", error)
    
    if (error.status === 404) {
      alert("無効な招待コードか、すでに使用済みのコードです。")
    } else {
      alert(`エラーが発生しました（ステータス: ${error.status}）\nPocketBaseのinvitesコレクションのAPIルール（List/View/Delete）が解放されているか確認してください。`)
    }
  }
}

// 💬 チャット画面へ移動
const goToChat = (targetUserId) => {
  router.push(`/message/${targetUserId}`)
}

onMounted(() => {
  if (!currentUser) {
    router.push('/login')
    return
  }
  fetchInitialData()
})
</script>

<template>
  <div class="max-w-xl mx-auto p-6 space-y-8">
    <h1 class="text-2xl font-bold">チャット管理 (招待コード方式)</h1>

    <!-- 🛠️ エリアA: 招待コードを発行する（自分が誘う側） -->
    <div class="p-5 border rounded-lg bg-indigo-50 border-indigo-200 shadow-sm space-y-4">
      <h2 class="font-bold text-sm text-indigo-900">📤 チャットに相手を招待する</h2>
      <p class="text-xs text-indigo-700 leading-relaxed">
        ボタンを押して4桁の招待コードを発行し、システム外（メール、電話など）で相手に伝えてください。
      </p>
      
      <div class="flex items-center gap-4">
        <button 
          @click="generateInviteCode"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition"
        >
          {{ myCreatedCode ? 'コードを再発行する' : '招待コードを発行する' }}
        </button>

        <div v-if="myCreatedCode" class="flex items-center gap-2 bg-white px-4 py-1.5 border-2 border-indigo-500 rounded-md">
          <span class="text-xs text-indigo-500 font-bold">現在のコード:</span>
          <span class="text-xl font-black tracking-widest text-indigo-900">{{ myCreatedCode }}</span>
        </div>
      </div>
    </div>

    <!-- 📥 エリアB: 招待コードを入力する（自分が誘われる側） -->
    <div class="p-5 border rounded-lg bg-green-50 border-green-200 shadow-sm space-y-4">
      <h2 class="font-bold text-sm text-green-900">📥 招待コードを入力して参加する</h2>
      <p class="text-xs text-green-700 leading-relaxed">
        相手から教えてもらった4桁の招待コードを入力すると、すぐにチャットが開始できます。
      </p>
      
      <div class="flex gap-2">
        <input 
          v-model="inputCode"
          type="text" 
          maxlength="4"
          placeholder="4桁の数字を入力" 
          class="w-32 px-3 py-2 border rounded-md text-center text-lg font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button 
          @click="handleVerifyCode"
          class="px-5 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition"
        >
          コードを認証
        </button>
      </div>
    </div>

    <!-- 💬 エリアC: チャット可能なユーザー一覧 -->
    <div class="space-y-3">
      <h2 class="font-bold text-gray-800 text-sm">💬 つながっているチャット一覧</h2>
      <div v-if="activeChats.length > 0" class="border rounded-lg divide-y bg-white shadow-sm">
        <div 
          v-for="chat in activeChats" 
          :key="chat.relationId" 
          class="p-4 flex items-center justify-between"
        >
          <div>
            <p class="font-bold text-gray-800">
              {{ chat.partner?.name || chat.partner?.username || '名前未設定' }}
            </p>
            <p class="text-xs text-gray-400">{{ chat.partner?.email }}</p>
          </div>
          <button 
            @click="goToChat(chat.partner?.id)"
            class="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-bold hover:bg-slate-900 transition"
          >
            チャットを開く
          </button>
        </div>
      </div>
      <div v-else class="text-center text-gray-400 py-8 border rounded-lg border-dashed text-sm">
        まだつながっているチャット相手はいません。<br>コードを発行するか、相手のコードを入力してください。
      </div>
    </div>
  </div>
</template>