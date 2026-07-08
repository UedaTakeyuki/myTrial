<!-- /src/components/message/InviteManager.vue -->
<script setup>
import { ref } from 'vue'

// 親コンポーネントから状態と関数を受け取る
defineProps({
  myCreatedCode: { type: String, default: '' },
  isProcessing: { type: Boolean, default: false }
})

const emit = defineEmits(['generate-code', 'verify-code'])

const inputCode = ref('')
const isManagementOpen = ref(false)

const handleVerify = () => {
  if (!inputCode.value.trim()) return
  emit('verify-code', inputCode.value.trim(), () => {
    inputCode.value = '' // 成功時のコールバックでクリア
  })
}
</script>

<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <!-- トリガーボタン -->
    <button 
      @click="isManagementOpen = !isManagementOpen"
      class="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none"
    >
      <span class="flex items-center gap-1.5">
        <span>➕</span> 新しいチャット相手を追加する (招待コード)
      </span>
      <span class="text-xs text-gray-400 dark:text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': isManagementOpen }">
        ▼
      </span>
    </button>

    <!-- 「にゅーっと」開閉アニメーション -->
    <div 
      class="grid transition-all duration-300 ease-in-out"
      :class="isManagementOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
    >
      <div class="overflow-hidden">
        <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4 bg-white dark:bg-gray-800">
          
          <!-- 📥 エリアB: 招待コードを入力する -->
          <div class="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50 space-y-3">
            <h3 class="font-bold text-xs text-green-900 dark:text-green-400">📥 相手のコードを入力して参加する</h3>
            <p class="text-xs text-green-700 dark:text-green-500">4桁の招待コードを入力すると、すぐにチャットを開始できます。</p>
            <div class="flex gap-2">
              <input 
                v-model="inputCode"
                type="text" 
                maxlength="4"
                :disabled="isProcessing"
                placeholder="4桁" 
                class="w-24 px-3 py-1.5 border rounded-md text-center text-base font-bold tracking-widest bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              />
              <button 
                @click="handleVerify"
                :disabled="isProcessing"
                class="px-4 py-1.5 bg-green-600 dark:bg-green-700 text-white rounded-md text-xs font-medium hover:bg-green-700 dark:hover:bg-green-600 transition disabled:opacity-50"
              >
                コードを認証
              </button>
            </div>
          </div>

          <!-- 📤 エリアA: 招待コードを発行する -->
          <div class="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50 border-gray-200 dark:border-gray-700 space-y-3">
            <h3 class="font-bold text-xs text-gray-800 dark:text-gray-300">📤 自分の招待コードを発行する</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400">コードを発行し、チャットしたい相手に伝えてください。</p>
            <div class="flex items-center gap-3">
              <button 
                @click="emit('generate-code')"
                :disabled="isProcessing"
                class="px-4 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition disabled:opacity-50 shadow-sm"
              >
                {{ myCreatedCode ? 'コードを再発行' : 'コードを発行' }}
              </button>
              <div v-if="myCreatedCode" class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md">
                <span class="text-[10px] text-gray-500 dark:text-gray-400 font-bold">発行中:</span>
                <span class="text-base font-black tracking-widest text-gray-800 dark:text-gray-200">{{ myCreatedCode }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
