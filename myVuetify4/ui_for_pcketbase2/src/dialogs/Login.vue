<template>
<v-dialog
  v-model="isOpen"
  width="auto"
>
  <v-card
    prepend-icon="mdi-login"
    subtitle="Sign In/Up"
  >

    <SignInDlg 
      v-if="showIn" 
      :model-value="showIn" 
      @update:model-value="showIn = $event"
    />
    <SignUpDlg 
      v-else 
      :model-value="showIn" 
      @update:model-value="showIn = $event" 
      @success="onSignUpSuccess" 
    />
  </v-card>

</v-dialog>
</template>


<script setup>
  import SignInDlg from '@/components/SignIn.vue'
  import SignUpDlg from '@/components/SignUp.vue'
  import { ref, onMounted } from 'vue'

  const showIn = ref(true)

  // defineModel を使うことで、親の v-model と自動的に双方向同期されます
  const isOpen = defineModel({ type: Boolean, default: false })

  const onSignUpSuccess = (authData) => {
    console.log('親コンポーネントで登録成功を検知しました:', authData)
    
    // ここでルーティングをマイページに切り替えたり、
    // ユーザーのグローバルな状態（Piniaなど）を更新します

    // close dialog
    isOpen.value = false
  }
</script>