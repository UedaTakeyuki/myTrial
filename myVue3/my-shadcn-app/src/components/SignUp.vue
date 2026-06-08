<template>
  <div class="w-full max-w-md mx-auto">
    
    <!-- 一般的なエラー（システムエラーなど）の表示 -->
    <Alert
      v-if="serversideErrors.message"
      variant="destructive"
      class="mb-4 rounded-lg"
    >
      <AlertDescription>{{ serversideErrors.message }}</AlertDescription>
    </Alert>

    <!-- 1. 入力フィールド：Name -->
    <div class="space-y-2 mb-3 mx-1">
      <Label for="name">Name</Label>
      <div class="relative flex items-center">
        <User class="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="name"
          v-model="name"
          placeholder="Jane Doe"
          class="pl-9"
        />
      </div>
    </div>

    <!-- メールアドレス入力欄 -->
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
      <!-- サーバーサイドのエラー表示 -->
      <p 
        v-if="serversideErrors.data?.email?.message" 
        class="text-sm font-medium text-destructive mt-1"
      >
        {{ serversideErrors.data.email.message }}
      </p>
    </div>

    <!-- パスワード入力欄 -->
    <div class="space-y-2 mb-3 mx-1">
      <Label for="password">Password</Label>
      <PwInput 
        id="password"
        v-model="pw"
        placeholder="••••••••"
      />
      <!-- クライアント or サーバーサイドのエラー表示 -->
      <p 
        v-if="clientErrors.pw || serversideErrors.data?.password?.message" 
        class="text-sm font-medium text-destructive mt-1"
      >
        {{ clientErrors.pw || serversideErrors.data?.password?.message }}
      </p>
    </div>

    <!-- パスワード再確認入力欄 -->
    <div class="space-y-2 mb-4 mx-1">
      <Label for="passwordConfirm">Password Confirm</Label>
      <PwInput 
        id="passwordConfirm"
        v-model="pw2"
        placeholder="••••••••"
      />
      <!-- クライアント or サーバーサイドのエラー表示 -->
      <p 
        v-if="clientErrors.pw2 || serversideErrors.data?.passwordConfirm?.message" 
        class="text-sm font-medium text-destructive mt-1"
      >
        {{ clientErrors.pw2 || serversideErrors.data?.passwordConfirm?.message }}
      </p>
    </div>

    <!-- 2. ボタン配置：メインボタン -->
    <Button
      variant="default"
      class="w-full h-12 rounded-xl font-bold text-base mb-3"
      :disabled="loading"
      @click="signUpUser"
    >
      <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
      Create Account
    </Button>

    <!-- 切り替えリンク -->
    <div class="text-center text-sm text-muted-foreground">
      <span>Already have an account? </span>
      <Button 
        variant="link" 
        class="p-0 h-auto font-bold text-primary hover:no-underline" 
        @click="showIn = true"
      >
        Sign In
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
  import { User, Mail, Loader2 } from 'lucide-vue-next'

  import pb from '@/lib/pocketbase'

  const emit = defineEmits(['success'])
//  const pb = new PocketBase('https://pocketbase.uedasoft.com');

  const email = ref('')
  const pw = ref('')
  const pw2 = ref('')
  const name = ref('')
  const serversideErrors = ref({})
  const clientErrors = ref({ pw: '', pw2: '' })
  const loading = ref(false)

  // 親から渡された表示切り替えフラグを受け取る
  const showIn = defineModel({ type: Boolean, default: false })

  // フロントエンド側での簡易バリデーション
  const validateForm = () => {
    let isValid = true
    clientErrors.value = { pw: '', pw2: '' }

    if (!pw.value) {
      clientErrors.value.pw = 'Cannot be blank.'
      isValid = false
    } else if (pw.value.length < 8) {
      clientErrors.value.pw = 'Must be at least 8 character(s).'
      isValid = false
    }

    if (pw.value !== pw2.value) {
      clientErrors.value.pw2 = 'password not match.'
      isValid = false
    }

    return isValid
  }

  const signUpUser = async () => {
    if (loading.value) return
    
    // クライアントバリデーション実行
    if (!validateForm()) return

    loading.value = true
    serversideErrors.value = {}

    const data = {
      "email": email.value,
      "password": pw.value,
      "passwordConfirm": pw2.value,
      "name": name.value
    };

    try {
      const record = await pb.collection('users').create(data);
      console.log('Successfully registered:', record.id);

      const authData = await pb.collection("users").authWithPassword(email.value, pw.value);
      emit('success', authData);
    } catch (err) {
      console.error('Registration failed:', err);
      if (err.response && err.response.data) {
        serversideErrors.value = err.response;
      } else {
        serversideErrors.value = { message: err.message || '予期せぬエラーが発生しました。', data: {} };
      }
    } finally {
      loading.value = false
    }
  }
</script>
