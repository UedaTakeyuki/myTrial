<template>
  <div class="w-full max-w-md mx-auto">
    
    <!-- 一般的なエラーの表示 (v-alert の代替) -->
    <Alert
      v-if="serversideErrors.message"
      variant="destructive"
      class="mb-4 rounded-lg"
    >
      <AlertDescription>{{ serversideErrors.message }}</AlertDescription>
    </Alert>

    <!-- 1. メールアドレス入力欄 (v-text-field の代替) -->
    <div class="space-y-2 mb-3 mx-1">
      <Label for="email">Email address</Label>
      <div class="relative flex items-center">
        <Mail class="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="email"
          v-model="email"
          type="email"
          placeholder="johndoe@gmail.com"
          class="pl-9"
        />
      </div>
    </div>

    <!-- 2. パスワード入力欄 (先ほどの PwInput を使用) -->
    <div class="space-y-2 mb-4 mx-1">
      <Label for="password">Password</Label>
      <PwInput 
        id="password"
        v-model="pw"
        placeholder="••••••••"
      />
      <!-- サーバーサイドのバリデーションエラー表示 -->
      <p 
        v-if="serversideErrors.data?.password?.message" 
        class="text-sm font-medium text-destructive mt-1"
      >
        {{ serversideErrors.data.password.message }}
      </p>
    </div>

    <!-- 3. ログインボタン (v-btn の代替) -->
    <Button
      variant="default"
      class="w-full h-12 rounded-xl font-bold text-base mb-3"
      :disabled="loading"
      @click="signInUser"
    >
      <!-- ローディング時のインジケーター (LucideのLoader2を回転) -->
      <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
      Sign In
    </Button>

    <!-- 4. アカウント作成画面への切り替えリンク -->
    <div class="text-center text-sm text-muted-foreground">
      <span>Don't have an account? </span>
      <Button 
        variant="link" 
        class="p-0 h-auto font-bold text-primary hover:no-underline" 
        @click="showIn = false"
      >
        Sign Up
      </Button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import PocketBase from 'pocketbase'
  import PwInput from '@/components/PwInput.vue'
  
  // shadcn-vue と Lucide アイコンのインポート
  import { Alert, AlertDescription } from '@/components/ui/alert'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { Button } from '@/components/ui/button'
  import { Mail, Loader2 } from 'lucide-vue-next'

  const emit = defineEmits(['success'])
  const pb = new PocketBase('https://pocketbase.uedasoft.com');

  const email = ref('')
  const pw = ref('')
  const serversideErrors = ref({})
  const loading = ref(false)

  // 親から渡された表示切り替えフラグ
  const showIn = defineModel({ type: Boolean, default: true })

  // Sign In 処理
  const signInUser = async () => {
    if (loading.value) return

    loading.value = true
    serversideErrors.value = {}

    try {
      // PocketBaseでのログイン処理
      const authData = await pb.collection("users").authWithPassword(email.value, pw.value);
      console.log('Successfully signed in:', authData.record.id);

      emit('success', authData);
    } catch (err) {
      console.error('Sign in failed:', err);
      if (err.response && err.response.data) {
        serversideErrors.value = err.response;
      } else {
        serversideErrors.value = { message: err.message || 'メールアドレスまたはパスワードが正しくありません。', data: {} };
      }
    } finally {
      loading.value = false
    }
  }
</script>
