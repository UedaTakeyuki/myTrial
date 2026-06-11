<!-- src/components/UserMenu.vue -->
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <!-- 💡 修正：border-zinc-800 から border-border に変更 -->
      <Button variant="ghost" class="relative h-8 w-8 rounded-full border border-border p-0 hover:opacity-80">
        <Avatar class="h-8 w-8">
          <!-- 💡 おまけ：GitHubの画像を正しく表示するためにダミーURLからアバター用URLに変更するか、プレースホルダーに任せます -->
          <!-- 💡 修正前: <AvatarImage src="https://github.com" alt="@shadcn" /> -->
          <!-- 👇 修正後: 計算したアバターURLをバインドし、altにはユーザー名を指定 -->
          <AvatarImage :src="avatarUrl" :alt="name" />          <!-- 💡 修正：bg-zinc-800 text-zinc-200 から bg-muted text-muted-foreground に変更 -->
          <AvatarFallback class="bg-muted text-muted-foreground text-xs">CN</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    
    <!-- 💡 修正：背景色や枠線の固定クラス（bg-zinc-900 など）を削除 -->
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none text-foreground">{{name}}</p>
          <p class="text-xs leading-none text-muted-foreground">{{email}}</p>
        </div>
      </DropdownMenuLabel>
      
      <!-- 💡 修正：bg-zinc-800 を削除（自動で border カラーになります） -->
      <DropdownMenuSeparator />
      
      <!-- 💡 修正：focus:bg-zinc-800 などを削除（自動で適切なフォーカスカラーになります） -->
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Billing</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
      
      <DropdownMenuSeparator />
      
      <!-- 💡 修正：ログアウト時のフォーカス色をセマンティックな赤（destructive）に変更 -->
      <!-- 💡 ログイン中の場合：Log out ボタンを表示 -->
      <DropdownMenuItem 
        v-if="isLoggedIn"
        class="text-destructive font-medium focus:bg-destructive/10 focus:text-destructive"
        @click="logout"
      >
        Log out
      </DropdownMenuItem>
      <!-- 💡 未ログインの場合：Log in ボタンを表示 -->
      <DropdownMenuItem 
        v-else
        class="font-medium text-primary focus:bg-primary/10 focus:text-primary"
        @click="login"
      >
        Log in
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>


<script setup>
import { ref, inject, onUnmounted, computed } from 'vue' // 💡 computed を追加
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import pb from '@/lib/pocketbase' 

// 💡 ログイン状態やユーザー情報を一つのリアクティブなオブジェクトとして管理するとスッキリします
const currentUser = ref(pb.authStore.model)
const isLoggedIn = ref(pb.authStore.isValid)

// 💡 ユーザー名とメールアドレスは computed（算出プロパティ）にすると、連動して自動更新されます
const name = computed(() => currentUser.value?.name || currentUser.value?.username || "Not logged in")
const email = computed(() => currentUser.value?.email || "")

// 🌟 アバター画像URLの生成（PocketBaseのファイル取得URLの規則に合わせる）
const avatarUrl = computed(() => {
  if (!currentUser.value || !currentUser.value.avatar) return ""
  // PocketBaseの仕様: /api/files/コレクション名/レコードID/ファイル名
  return `${pb.baseUrl}/api/files/${currentUser.value.collectionId}/${currentUser.value.id}/${currentUser.value.avatar}`
})

// 🌟 PocketBase の認証状態をリアルタイム監視
const unsubscribe = pb.authStore.onChange((token, model) => {
  isLoggedIn.value = pb.authStore.isValid
  currentUser.value = model // ユーザー情報を丸ごと更新
})

// コンポーネントが消えるときに監視を解除（メモリリーク防止）
onUnmounted(() => {
  unsubscribe()
})

// 💡 App.vue から提供された関数を inject する
const openLoginDialog = inject('openLoginDialog')

const logout = () => {
  pb.authStore.clear() // これで onChange が走り、画面が未ログイン状態になります
}

const login = () => {
  if (openLoginDialog) {
    openLoginDialog()
  }
}
</script>

