<!-- src/components/DocsSearch.vue -->
<template>
  <div class="mb-4 w-full max-w-sm">
    <div class="relative flex items-center w-full">
      <!-- 虫眼鏡アイコン -->
      <svg class="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      
      <!-- 入力欄 -->
      <input 
        v-model="modelValue" 
        type="text" 
        placeholder="Search posts..."
        class="w-full pl-9 pr-8 py-1.5 text-sm bg-secondary text-secondary-foreground border border-transparent rounded outline-none transition-all focus:bg-background focus:border-primary"
      />
      
      <!-- クリアボタン -->
      <button 
        v-if="modelValue" 
        @click="modelValue = ''" 
        class="absolute right-2.5 text-muted-foreground hover:text-foreground text-xs p-1"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
// Vue 3.4 以降で推奨されている双方向バインディングのマクロ
const modelValue = defineModel({ type: String, default: '' })
</script>
