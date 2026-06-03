<template>
<v-dialog
  v-model="isOpen"
  width="auto"
>
  <v-card
    max-width="400"
    prepend-icon="mdi-update"
    text="彡⌒ミ がいるぞ殺せ！"
  >
  </v-card>
</v-dialog>
</template>

<script setup>
// defineModel を使うことで、親の v-model と自動的に双方向同期されます
  const isOpen = defineModel({ type: Boolean, default: false })
</script>