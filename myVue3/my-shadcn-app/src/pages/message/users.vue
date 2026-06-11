<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router/auto'
import pb from '@/lib/pocketbase'

const router = useRouter()
const currentUser = pb.authStore.record
const users = ref([])         // 自分以外のユーザー一覧
const relations = ref([])     // 自分に関係のある承認状態リスト

// データの初期取得
const fetchData = async () => {
  try {
    // 1. 自分以外の全ユーザーを取得 (メールアドレス登録ユーザー)
    users.value = await pb.collection('users').getFullList({
      filter: `id != "${currentUser.id}"`,
      sort: '-created'
    })

    // 2. 自分が関わっている承認状態（友達関係）をすべて取得
    relations.value = await pb.collection('friends').getFullList({
      requestKey: null
    })
  } catch (error) {
    console.error("データ取得失敗:", error)
  }
}

// 特定のユーザーとの承認状態をチェックする関数
const getRelationStatus = (targetUserId) => {
  const rel = relations.value.find(r => 
    (r.user_from === currentUser.id && r.user_to === targetUserId) ||
    (r.user_from === targetUserId && r.user_to === currentUser.id)
  )
  if (!rel) return { type: 'none' } // 申請関係なし
  if (rel.status === 'accepted') return { type: 'accepted', id: rel.id } // 承認済み
  
  // 承認待ちの場合、どちらが送信者かで分ける
  if (rel.user_from === currentUser.id) {
    return { type: 'sent_pending', id: rel.id } // 自分が申請中
  } else {
    return { type: 'received_pending', id: rel.id } // 相手から申請が届いている
  }
}

// 🤝 1. チャット申請を送る
const sendRequest = async (targetUserId) => {
  try {
    await pb.collection('friends').create({
      user_from: currentUser.id,
      user_to: targetUserId,
      status: 'pending'
    })
    await fetchData() // 画面を更新
  } catch (error) {
    alert("申請に失敗しました")
  }
}

// ✅ 2. 相手からの申請を承認する
const acceptRequest = async (relationId) => {
  try {
    await pb.collection('friends').update(relationId, {
      status: 'accepted'
    })
    await fetchData() // 画面を更新
  } catch (error) {
    alert("承認に失敗しました")
  }
}

// 💬 3. チャットページへ安全に遷移する
const goToChat = (targetUserId) => {
  // 先ほど作った [uid].vue のルートへ、相手のIDを渡して移動
  router.push(`/message/${targetUserId}`)
}

onMounted(() => {
  if (!currentUser) {
    router.push('/login') // 未ログインならログインへ（環境に合わせて調整してください）
    return
  }
  fetchData()
})
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">ユーザー一覧 (チャット相手を探す)</h1>

    <div class="space-y-4">
      <div 
        v-for="user in users" 
        :key="user.id" 
        class="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
      >
        <div>
          <!-- メールアドレスを画面内に安全に表示 -->
          <p class="font-medium text-gray-800">{{ user.email }}</p>
          <p class="text-xs text-gray-400">ID: {{ user.id }}</p>
        </div>

        <div>
          <!-- 状態：関係なし ➔ 申請ボタン -->
          <button 
            v-if="getRelationStatus(user.id).type === 'none'"
            @click="sendRequest(user.id)"
            class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
          >
            チャット申請を送る
          </button>

          <!-- 状態：自分が申請中 ➔ 承認待ちの表示 -->
          <span 
            v-else-if="getRelationStatus(user.id).type === 'sent_pending'"
            class="px-4 py-2 bg-gray-100 text-gray-500 rounded-md text-sm border inline-block"
          >
            相手の承認待ち...
          </span>

          <!-- 状態：相手から申請あり ➔ 承認するボタン -->
          <button 
            v-else-if="getRelationStatus(user.id).type === 'received_pending'"
            @click="acceptRequest(getRelationStatus(user.id).id)"
            class="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition animated pulse infinite"
          >
            申請を承認してチャット開始
          </button>

          <!-- 状態：承認済み ➔ チャットページをアクティブにする -->
          <button 
            v-else-if="getRelationStatus(user.id).type === 'accepted'"
            @click="goToChat(user.id)"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition font-bold"
          >
            チャットを開く 💬
          </button>
        </div>
      </div>

      <!-- ユーザーがいない場合 -->
      <div v-if="users.length === 0" class="text-center text-gray-400 py-8">
        他のユーザーが見つかりません。
      </div>
    </div>
  </div>
</template>
