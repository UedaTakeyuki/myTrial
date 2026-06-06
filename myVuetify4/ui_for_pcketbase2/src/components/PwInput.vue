<template>
  <!-- 
    v-bind="$attrs" をつけることで、
    親（SignIn/SignUp）から渡された variant="solo-filled" や flat などの
    デザイン属性が、この v-text-field に自動で100%適用されます。
  -->
  <v-text-field
    v-bind="$attrs"
    :type="showPassword ? 'text' : 'password'"
    prepend-inner-icon="mdi-lock-outline"
    :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
    class="mx-1"
    @click:append-inner="showPassword = !showPassword" 
  />
</template>

<script setup>
  import { ref } from 'vue'

  // 親から渡されるデザイン用の属性（classやvariantなど）を、自動でv-text-fieldに引き継ぐ設定
  defineOptions({
    inheritAttrs: false
  })

  const showPassword = ref(false)
</script>
