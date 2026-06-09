<!-- components/MessageItem.vue -->
<template>
  <div :class="['flex items-end gap-2 max-w-[80%]', isMyMessage ? 'self-end flex-row-reverse' : 'self-start flex-row']">
    <!-- アバター -->
    <Avatar class="h-8 w-8 border flex-shrink-0">
      <AvatarImage v-if="avatarUrl" :src="avatarUrl" :alt="userName" />
      <AvatarFallback>{{ avatarText }}</AvatarFallback>
    </Avatar>

    <!-- 吹き出し部分 -->
    <div class="flex flex-col space-y-1">
      <span v-if="!isMyMessage" class="text-xs text-muted-foreground px-1">{{ userName }}</span>
      <Card :class="['p-3 text-sm shadow-sm rounded-2xl', isMyMessage ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-foreground rounded-bl-none']">
        <p class="whitespace-pre-wrap break-words">{{ msg.message }}</p>
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

const props = defineProps({
  msg: { type: Object, required: true },
  currentUserId: { type: String, required: true },
  avatarUrl: { type: String, default: '' }
})

// 計算プロパティにすることで、script 側を劇的にシンプルに
const isMyMessage = computed(() => props.msg.user_from === props.currentUserId)
const user = computed(() => props.msg.expand?.user_from || {})
const userName = computed(() => user.value.name || user.value.username || '名無しさん')
const avatarText = computed(() => userName.value.charAt(0).toUpperCase())

const formattedTime = computed(() => {
  if (!props.msg.created) return ''
  return new Date(props.msg.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})
</script>
