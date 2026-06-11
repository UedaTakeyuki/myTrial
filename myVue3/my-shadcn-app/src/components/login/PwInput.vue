<template>
  <!-- 
    Vuetifyのクラス（mx-1など）や属性は、そのままラッパーの親要素、
    または個別の要素に $attrs を通じて自動で100%適用されます。
  -->
  <div :class="['relative flex items-center', $attrs.class]">
    <!-- 左側の鍵アイコン (prepend-inner-icon の代替) -->
    <Lock class="absolute left-3 h-4 w-4 text-muted-foreground" />
    
    <!-- shadcn-vue風のInputコンポーネント -->
    <Input
      v-bind="filteredAttrs"
      :type="showPassword ? 'text' : 'password'"
      class="pl-9 pr-10"
    />
    
    <!-- 右側の目アイコンボタン (append-inner-icon の代替) -->
    <Button
      type="button"
      variant="ghost"
      size="icon"
      class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
      @click="showPassword = !showPassword"
    >
      <EyeOff v-if="showPassword" class="h-4 w-4 text-muted-foreground" />
      <Eye v-else class="h-4 w-4 text-muted-foreground" />
      <span class="sr-only">
        {{ showPassword ? 'パスワードを非表示にする' : 'パスワードを表示する' }}
      </span>
    </Button>
  </div>
</template>

<script setup>
  import { ref, computed, useAttrs } from 'vue'
  import { Input } from '@/components/ui/input'
  import { Button } from '@/components/ui/button'
  import { Lock, Eye, EyeOff } from 'lucide-vue-next'

  // 親から渡される属性（classや固有デザインなど）の手動制御を設定
  defineOptions({
    inheritAttrs: false
  })

  const attrs = useAttrs()
  const showPassword = ref(false)

  // class 属性だけを除外して Input コンポーネントにバインドするための算出プロパティ
  const filteredAttrs = computed(() => {
    const { class: _, ...rest } = attrs
    return rest
  })
</script>
