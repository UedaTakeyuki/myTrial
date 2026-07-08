<template>
  <Dialog v-model:open="isOpen">
    <!-- 
      【変更ポイント】
      - max-h-[90vh]: ダイアログの最大高さを画面縦幅の90%に制限
      - overflow-y-auto: 中身が入り切らない場合に内部スクロールを有効化
      - p-5: 全体の余白を p-6 から p-5 に少し縮小
    -->
    <DialogContent class="sm:max-w-[440px] max-h-[90vh] overflow-y-auto p-5 rounded-xl backdrop-blur-md bg-background/95">
      
      <!-- ヘッダー（余白を pb-4 から pb-2 に縮小、アバターも一回り小さく） -->
      <DialogHeader class="flex flex-col items-center text-center pb-2 select-none">
        <!-- w-14 h-14 -> w-12 h-12 に縮小 -->
        <div class="flex items-center justify-center bg-primary/10 text-primary w-12 h-12 rounded-full mb-2">
          <!-- h-7 w-7 -> h-6 w-6 に縮小 -->
          <ShieldAlert class="h-6 w-6" />
        </div>
        
        <!-- text-2xl -> text-xl に縮小 -->
        <DialogTitle class="text-xl font-bold tracking-tight">
          Welcome Back
        </DialogTitle>
        <DialogDescription class="text-xs text-muted-foreground mt-0.5">
          サインインまたはアカウントを作成
        </DialogDescription>
      </DialogHeader>

      <!-- メインコンテンツ（SignIn / SignUp） -->
      <div class="py-0">
        <SignInDlg 
          v-if="showIn" 
          v-model="showIn"
        />
        <SignUpDlg 
          v-else 
          v-model="showIn" 
          @success="onSignUpSuccess" 
        />
      </div>

      <!-- フッター（余白を pt-4 から pt-2 に縮小） -->
      <DialogFooter class="sm:justify-center pt-2">
        <DialogClose as-child>
          <Button
            variant="ghost"
            class="text-xs text-muted-foreground rounded-lg h-8 px-4 hover:bg-muted"
          >
            閉じる
          </Button>
        </DialogClose>
      </DialogFooter>

    </DialogContent>
  </Dialog>
</template>

<script setup>
  import { ref } from 'vue'
  import SignInDlg from '@/components/login/SignIn.vue'
  import SignUpDlg from '@/components/login/SignUp.vue'
  
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { ShieldAlert } from 'lucide-vue-next'

  const showIn = ref(true)
  const isOpen = defineModel({ type: Boolean, default: false })

  const onSignUpSuccess = (authData) => {
    isOpen.value = false
  }
</script>
