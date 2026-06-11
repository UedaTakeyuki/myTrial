<!-- components/MessageItem.vue -->
<template>
  <div :class="['flex items-end gap-2 max-w-[80%]', isMyMessage ? 'self-end flex-row-reverse' : 'self-start flex-row']">
    <!-- アバター -->
    <Avatar class="h-8 w-8 border flex-shrink-0">
      <AvatarImage v-if="avatarUrl" :src="avatarUrl" :alt="userName" />
      <AvatarFallback>{{ avatarText }}</AvatarFallback>
    </Avatar>

    <!-- 吹き出し部分 -->
    <div class="flex flex-col space-y-1 max-w-full">
      <span v-if="!isMyMessage" class="text-xs text-muted-foreground px-1">{{ userName }}</span>
      
      <!-- 💡 吹き出しの幅やパディングを画像対応に微調整（p-3 から p-1.5 や overflow-hidden に変更） -->
      <Card :class="['text-sm shadow-sm rounded-2xl overflow-hidden', isMyMessage ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-foreground rounded-bl-none']">
        
        <!-- 添付画像がある場合の表示エリア -->
        <div v-if="imageUrl" class="p-1 w-[240px] sm:w-[280px] max-w-full">
          <!-- 💡 aspect-video（横長）や min-h（最低限の高さ）を指定して、読み込み前の潰れを防止する -->
          <img 
            :src="imageUrl" 
            alt="添付画像" 
            class="rounded-xl max-h-60 w-full aspect-video min-h-[150px] object-cover bg-muted cursor-pointer hover:opacity-95 transition-opacity" 
            @click="openImage"
          />
        </div>

        <!-- 💡 テキストがある場合のみパディングを持って表示（画像だけ送信にも対応） -->
        <p v-if="msg.message" class="whitespace-pre-wrap break-words px-3 pb-3 pt-2" :class="{ 'pt-1': imageUrl }">
          {{ msg.message }}
        </p>
      </Card>

      <!-- 送信時間 -->
      <div :class="['flex items-center gap-1.5 text-[10px] text-muted-foreground px-1', isMyMessage ? 'justify-end' : 'justify-start']">
        <span>{{ formattedTime }}</span>
        <Badge v-if="isMyMessage && msg.user_to?.length > 1" variant="secondary" class="text-[9px] px-1 py-0 h-4">
          他{{ msg.user_to.length - 1 }}人
        </Badge>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
// 💡 PocketBaseの共通インスタンスをインポートしてベースURL等を利用できるようにする
import pb from '@/lib/pocketbase'

const props = defineProps({
  msg: { type: Object, required: true },
  currentUserId: { type: String, required: true },
  avatarUrl: { type: String, default: '' }
})

// 計算プロパティ
const isMyMessage = computed(() => props.msg.user_from === props.currentUserId)
const user = computed(() => props.msg.expand?.user_from || {})
const userName = computed(() => user.value.name || user.value.username || '名無しさん')
const avatarText = computed(() => userName.value.charAt(0).toUpperCase())

// 💡 添付画像の配信URLを PocketBase の仕様に則って組み立てる
const imageUrl = computed(() => {
  // レコードに file フィールドが存在しない、または空の場合は何もしない
  if (!props.msg || !props.msg.file) return ''
  
  // PocketBase のファイル取得URLルール: 
  // [ベースURL]/api/files/[コレクション名かID]/[レコードID]/[ファイル名]
  return `${pb.baseUrl}/api/files/${props.msg.collectionId}/${props.msg.id}/${props.msg.file}`
})

const formattedTime = computed(() => {
  if (!props.msg.created) return ''
  return new Date(props.msg.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

// 💡 画像をクリックした時に別タブで原寸大表示する処理（オプション）
const openImage = () => {
  if (imageUrl.value) {
    window.open(imageUrl.value, '_blank')
  }
}
</script>
