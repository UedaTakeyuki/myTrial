<!-- src/components/NotificationBell.vue -->
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative p-2 h-9 w-9 rounded-full hover:bg-muted transition-colors">
        <Bell class="w-5 h-5 text-muted-foreground" />
        <span v-if="notifications.length > 0" class="absolute top-1.5 right-1.5 flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
        </span>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-72" align="end">
      <DropdownMenuLabel class="font-semibold text-xs text-muted-foreground py-1.5 px-2">
        通知一覧 ({{ notifications.length }}件)
      </DropdownMenuLabel>
      
      <DropdownMenuSeparator />

      <template v-if="notifications.length > 0">
        <!-- 💡 項目全体をクリック可能にし、ホバー時に分かりやすくします -->
        <DropdownMenuItem 
          v-for="item in notifications.slice(0, 5)" 
          :key="item.id"
          class="flex flex-col items-start gap-1 cursor-pointer p-2.5 focus:bg-muted"
          @click="handleNotificationClick(item)"
        >
          <div class="flex items-center gap-1.5 w-full">
            <!-- 👤 友達申請の場合 -->
            <template v-if="item.type === 'friend_request'">
              <User class="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span class="text-xs font-semibold text-foreground truncate">{{ item.title }}</span>
            </template>
            
            <!-- 💬 新着メッセージの場合 -->
            <template v-else-if="item.type === 'new_message'">
              <MessageSquare class="w-3.5 h-3.5 text-green-500 shrink-0" />
              <span class="text-xs font-semibold text-foreground truncate">{{ item.title }}</span>
            </template>

            <!-- 🔔 その他の通知 -->
            <template v-else>
              <Bell class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span class="text-xs font-semibold text-foreground truncate">{{ item.title }}</span>
            </template>
          </div>

          <p class="text-[11px] text-muted-foreground leading-tight line-clamp-2 pl-5">
            {{ item.text }}
          </p>

          <!-- 💡 チャットへの遷移ボタン（視覚的にわかりやすくするため追加） -->
          <div v-if="item.type === 'friend_request' || item.type === 'new_message'" class="w-full flex justify-end mt-1">
            <span class="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
              チャットを開く →
            </span>
          </div>
        </DropdownMenuItem>
      </template>

      <div v-else class="text-center py-6 text-xs text-muted-foreground">
        新着の通知はありません
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Bell, User, MessageSquare } from '@lucide/vue'
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
const route = useRoute() // 💡 現在表示中のURL情報を取得

const notifications = ref([])
const currentUser = pb.authStore.record

// 🔥【追加】今まさに開いているチャット相手のID（URLが /message/相手のID の時だけ取得できる）
const activeChatPartnerId = computed(() => {
  // ルートのパスが /message/[uid] の構造になっているかチェック
  if (route.path.startsWith('/message/')) {
    return route.params.uid || ''
  }
  return ''
})

onMounted(async () => {
  if (!currentUser) return

  try {
    notifications.value = await pb.collection('notifications').getFullList({
      filter: `user_to = '${currentUser.id}' && is_read = false`,
      sort: '-created',
    })
  } catch (error) {
    console.error('通知データの初期取得に失敗しました:', error)
  }

  pb.collection('notifications').subscribe('*', (e) => {
    const record = e.record
    if (record.user_to !== currentUser.id) return

    if (e.action === 'create' && !record.is_read) {
      // 🔥【ここを修正】
      // もし届いた通知が「新着メッセージ（new_message）」で、かつ「いま画面を開いている相手（user_from）」からなら、
      // 鐘をチカチカさせない（配列に追加しない）で完全に無視する！
      if (record.type === 'new_message' && record.user_from === activeChatPartnerId.value) {
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
})

onUnmounted(() => {
  pb.collection('notifications').unsubscribe('*')
})

// 🔔 通知アイテムをクリックした時の処理
const handleNotificationClick = async (item) => {
  try {
    // 1. データベース上の該当レコードを既読に更新
    await pb.collection('notifications').update(item.id, {
      is_read: true
    })
    
    // 2. 🔥 type が friend_request または new_message の時はチャット画面へ遷移
    if (item.type === 'friend_request' || item.type === 'new_message') {
      // 送信元のIDを取得（PocketBaseの登録状況に合わせて item.user_from を指定）
      const partnerId = item.user_from
      
      if (partnerId) {
        router.push(`/message/${partnerId}`)
      } else {
        // 万が一IDが取れなかった場合のフォールバック（共通メッセージページなど）
        router.push('/message')
      }
    } 
    // 3. それ以外の汎用通知は設定された link_url に従う
    else if (item.link_url) {
      router.push(item.link_url)
    }
  } catch (error) {
    console.error('通知の既読更新に失敗しました:', error)
  }
}
</script>
