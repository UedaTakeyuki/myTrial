<template>
  <!-- 💡 親（元のヘッダー）の並び順に影響しないよう、単体のボタンとしてカプセル化 -->
  <!-- クリックしたら通知メニューを開く（今回は確認用にアラート） -->
  <button 
    @click="openNotificationMenu" 
    class="relative p-2 rounded-full hover:bg-muted transition-colors"
  >
    <!-- 鐘アイコン -->
    <Bell class="w-5 h-5 text-muted-foreground" />

    <!-- 通知がある時だけチカチカバッジを表示 -->
    <span v-if="notifications.length > 0" class="absolute top-1 right-1 flex h-2 w-2">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
      <span class="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
    </span>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Bell } from '@lucide/vue';
import pb from '@/lib/pocketbase'

// 🔔 未読通知の配列
const notifications = ref([])
const currentUser = pb.authStore.record

onMounted(async () => {
  if (!currentUser) return

  try {
    // ⏳ 1. 起動時にまず「自分宛て（user_to）」かつ「未読（is_read = false）」の通知を全件取得
    notifications.value = await pb.collection('notifications').getFullList({
      filter: `user_to = '${currentUser.id}' && is_read = false`,
      sort: '-created', // 新しい順
    })
  } catch (error) {
    console.error('通知データの初期取得に失敗しました:', error)
  }

  // 🔥 2. PocketBase のリアルタイム監視（Subscribe）を開始
  // 全てのレコード変更（*）を監視し、イベント内で自分宛てかどうかを判別します
  pb.collection('notifications').subscribe('*', (e) => {
    const record = e.record

    // 自分のための通知ではないデータは無視する
    if (record.user_to !== currentUser.id) return

    if (e.action === 'create' && !record.is_read) {
      // 🆕 A. 新しい未読通知が作成されたら配列の先頭に追加
      notifications.value.unshift(record)
    } 
    else if (e.action === 'update' && record.is_read) {
      // 👁️ B. 他の場所（ポップアップなど）で「既読」に更新されたら配列から削除
      notifications.value = notifications.value.filter(n => n.id !== record.id)
    } 
    else if (e.action === 'delete') {
      // 🗑️ C. 通知レコード自体が削除されたら配列から削除
      notifications.value = notifications.value.filter(n => n.id !== record.id)
    }
  })
})

// 🔌 3. コンポーネントが破棄された（画面移動した）ときは購読を解除してメモリを解放
onUnmounted(() => {
  pb.collection('notifications').unsubscribe('*')
})

const openNotificationMenu = async() => {
  if (notifications.value.length === 0) {
    alert('新着の通知はありません。')
    return
  };

  // 1. まずは画面に通知内容を表示する
  alert(
    `未読の通知が ${notifications.value.length} 件あります！\n\n` + 
    notifications.value.map(n => `・${n.text}`).join('\n')
  );

  // 2. 🔥【追加】アラートを閉じたら、溜まっていた未読通知をすべて既読に更新する
  try {
    // 複数の未読通知を一気に並列で更新処理（Promise.all）
    await Promise.all(
      notifications.value.map(notification =>
        pb.collection('notifications').update(notification.id, {
          is_read: true
        })
      )
    )
    // 💡 解説: 
    // PocketBase側でレコードが update されると、
    // 上で書いている `.subscribe('*')` の update イベントが自動的に走り、
    // `notifications.value` 配列からデータが消えて、チカチカが自動で止まります！
  } catch (error) {
    console.error('通知の既読更新に失敗しました:', error)
  } 
}
</script>