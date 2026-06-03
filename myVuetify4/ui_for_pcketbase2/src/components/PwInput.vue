<template>
  <v-text-field
    hint="Enter password"
    label="Password"
    :type="showPassword ? 'text' : 'password'"
    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
    @click:append-inner="showPassword = !showPassword" 
  />
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  const showPassword = ref(false)
</script>