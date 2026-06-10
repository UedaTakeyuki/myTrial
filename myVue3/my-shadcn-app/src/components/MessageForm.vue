<!-- components/MessageForm.vue -->
<template>
  <div class="p-4 border-t bg-background shrink-0 z-20">
    <!-- 画像のプレビュー表示 -->
    <div v-if="imagePreview" class="mb-2 relative inline-block">
      <img :src="imagePreview" class="h-14 w-14 object-cover rounded-md border" />
      <button type="button" @click="clearImage" class="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-sm hover:opacity-90">
        <svg xmlns="http://w3.org" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="flex gap-2 items-center">
      <!-- 隠しファイルインプット -->
      <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="onFileChange" />
      
      <Button type="button" size="icon" variant="outline" class="rounded-full h-10 w-10 shrink-0" @click="triggerFileInput" :disabled="isSending">
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
        </svg>
      </Button>

      <Input v-model="newMessage" placeholder="メッセージを入力..." class="flex-1 rounded-full px-4 h-10" :disabled="isSending" />
      
      <Button type="submit" size="icon" class="rounded-full h-10 w-10 shrink-0" :disabled="(!newMessage.trim() && !selectedFile) || isSending">
        <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
          <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
        </svg>
      </Button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

defineProps({
  isSending: { type: Boolean, default: false }
})

const emit = defineEmits(['send'])

const newMessage = ref('')
const fileInput = ref(null)
const selectedFile = ref(null)
const imagePreview = ref('')

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onFileChange = (e) => {
  const files = e.target.files
  if (files && files.length > 0) {
    const targetFile = files[0]
    selectedFile.value = targetFile
    imagePreview.value = URL.createObjectURL(targetFile)
  }
}

const clearImage = () => {
  selectedFile.value = null
  imagePreview.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

const handleSubmit = () => {
  if (!newMessage.value.trim() && !selectedFile.value) return
  
  // 親コンポーネントにテキストとファイルを渡す
  emit('send', {
    text: newMessage.value,
    file: selectedFile.value
  })

  // 送信が成功するかは親が制御するため、フォーム側は一旦クリア
  newMessage.value = ''
  clearImage()
}
</script>
