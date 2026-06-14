<!-- src/components/NotificationBell.vue -->
<template>
  <DropdownMenu>
    <!-- 1. トリガー（クリックを検知するボタン部分） -->
    <DropdownMenuTrigger as-child>
      <Button 
        variant="ghost" 
        class="relative p-2 h-9 w-9 rounded-full hover:bg-muted transition-colors"
      >
        <!-- 鐘アイコン -->
        <Bell class="w-5 h-5 text-muted-foreground" />

        <!-- 未読通知が1件以上ある時だけバッジを表示 -->
        <span v-if="notifications.length > 0" class="absolute top-1.5 right-1.5 flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
        </span>
      </Button>
    </DropdownMenuTrigger>

    <!-- 2. ポップアップメニューの中身（右端を揃えるため align="end" を指定） -->
    <DropdownMenuContent class="w-64" align="end">
      <DropdownMenuLabel class="font-semibold text-xs text-muted-foreground py-1.5 px-2">
        通知一覧 ({{ notifications.length }}件)
      </DropdownMenuLabel>
      
      <DropdownMenuSeparator />

      <!-- A. 未読通知がある場合（最大5件を表示） -->
      <template v-if="notifications.length > 0">
        <DropdownMenuItem 
          v-for="item in notifications.slice(0, 5)" 
          :key="item.id"
          class="flex flex-col items-start gap-0.5 cursor-pointer p-2.5 focus:bg-muted"
          @click="handleNotificationClick(item)"
        >
          <div class="flex items-center gap-1 w-full">
            <Bell class="w-3 h-3 text-destructive shrink-0 animate-pulse" />
            <span class="text-xs font-semibold text-foreground truncate">{{ item.title }}</span>
          </div>
          <p class="text-[11px] text-muted-foreground leading-tight line-clamp-2 pl-4">
            {{ item.text }}
          </p>
        </DropdownMenuItem>
      </template>

      <!-- B. 未読通知が1件もない場合 -->
      <div v-else class="text-center py-6 text-xs text-muted-foreground">
        新着の通知はありません
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bell } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import pb from '@/lib/pocketbase'

const router = useRouter()
const notifications = ref([])
const currentUser = pb.authStore.record

onMounted(async () => {
  if (!currentUser) return

  try {
    // ⏳ 1. 起動時に自分宛ての未読通知を全件取得
    notifications.value = await pb.collection('notifications').getFullList({
      filter: `user_to = '${currentUser.id}' && is_read = false`,
      sort: '-created',
    })
  } catch (error) {
    console.error('通知データの初期取得に失敗しました:', error)
  }

  // 🔥 2. PocketBase のリアルタイム監視（Subscribe）を開始
  pb.collection('notifications').subscribe('*', (e) => {
    const record = e.record
    if (record.user_to !== currentUser.id) return

    if (e.action === 'create' && !record.is_read) {
      notifications.value.unshift(record)
    } 
    else if (e.action === 'update' && record.is_read) {
      notifications.value = notifications.value.filter(n => n.id !== record.id)
    } 
    else if (e.action === 'delete') {
      notifications.value = notifications.value.filter(n => n.id !== record.id)
    }
  })
})

// 🔌 3. 画面移動時の購読解除
onUnmounted(() => {
  pb.collection('notifications').unsubscribe('*')
})

// 🔔 通知アイテムをクリックした時の個別処理
const handleNotificationClick = async (item) => {
  try {
    // 1. データベース上の該当レコードを既読（is_read = true）に更新
    // これにより subscribe 経由で、自動的に通知配列（notifications）から削除されます
    await pb.collection('notifications').update(item.id, {
      is_read: true
    })
    
    // 2. 通知に設定されている遷移先 URL (例: /messages) があれば遷移する
    if (item.link_url) {
      router.push(item.link_url)
    }
  } catch (error) {
    console.error('通知の既読更新に失敗しました:', error)
  }
}
</script>
