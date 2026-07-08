<template>
  <v-dialog
    v-model="isOpen"
    max-width="440px"
    transition="dialog-bottom-transition"
    class="backdrop-blur"
  >
    <!-- 全体のカード（pa-6 で内側に綺麗な余白を作ります） -->
    <v-card class="pa-6 rounded-xl" flat>
      
      <!-- ヘッダー（タイトル部分） -->
      <v-card-item class="justify-center text-center pb-4">
        <v-avatar color="primary" variant="tonal" size="56" class="mb-4">
          <v-icon icon="mdi-shield-key-outline" size="28" />
        </v-avatar>
        <v-card-title class="text-h5 font-weight-bold tracking-tight">
          Welcome Back
        </v-card-title>
        <v-card-subtitle class="text-body-2 text-medium-emphasis mt-1">
          サインインまたはアカウントを作成
        </v-card-subtitle>
      </v-card-item>

      <!-- 【重要】v-card-text（pa-0）で中身を包む -->
      <!-- これにより、子コンポーネントの「w-100（横幅100%）」がカードの枠を突き抜けなくなります -->
      <v-card-text class="pa-0">
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
      </v-card-text>

      <!-- フッター（閉じるボタン） -->
      <v-card-actions class="justify-center pt-4">
        <v-btn
          variant="text"
          color="medium-emphasis"
          class="text-none text-caption rounded-lg px-4"
          @click="close"
        >
          閉じる
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.backdrop-blur :deep(.v-overlay__content) {
  backdrop-filter: blur(8px);
}
.tracking-tight {
  letter-spacing: -0.025em !important;
}
</style>

<script setup>
  import SignInDlg from '@/components/SignIn.vue'
  import SignUpDlg from '@/components/SignUp.vue'
  import { ref } from 'vue'

  const showIn = ref(true)
  const isOpen = defineModel({ type: Boolean, default: false })

  const onSignUpSuccess = (authData) => {
    isOpen.value = false
  }
  
  const close = () => {
    isOpen.value = false
  }
</script>