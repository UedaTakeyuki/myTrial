<!-- src/components/UserMenu.vue -->
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <!-- 💡 修正：border-zinc-800 から border-border に変更 -->
      <Button variant="ghost" class="relative h-8 w-8 rounded-full border border-border p-0 hover:opacity-80">
        <Avatar class="h-8 w-8">
          <!-- 💡 おまけ：GitHubの画像を正しく表示するためにダミーURLからアバター用URLに変更するか、プレースホルダーに任せます -->
          <AvatarImage src="https://github.com" alt="@shadcn" />
          <!-- 💡 修正：bg-zinc-800 text-zinc-200 から bg-muted text-muted-foreground に変更 -->
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
import { ref, inject, onUnmounted } from 'vue'
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
import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase.uedasoft.com');

// 1. 最初は現在の状態をセット

// 💡 ログイン状態を管理する ref（true または false）
const isLoggedIn = ref(pb.authStore.isValid);
const user = pb.authStore.model;
const name = ref(user?.name || "Not logged in");
const email = ref(user?.email || "");

// 🌟 ここがポイント：PocketBase の認証状態をリアルタイム監視！
// ログイン・ログアウトが走ると、この関数が自動で実行されます
const unsubscribe = pb.authStore.onChange((token, model) => {
  isLoggedIn.value = pb.authStore.isValid;
  name.value = model?.name || "Not logged in";
  email.value = model?.email || "";
});

// コンポーネントが消えるときに監視を解除（メモリリーク防止）
onUnmounted(() => {
  unsubscribe();
});

// 💡 追加：App.vue から提供された関数を inject する
const openLoginDialog = inject('openLoginDialog')

const logout = () => {
  pb.authStore.clear(); // 👈 これを実行すると、上の onChange が自動で動いて画面が変わります！
/*
  pb.authStore.clear(); // PocketBaseの認証情報を削除
  isLoggedIn.value = false;  // ログイン状態を false に
  name.value = "Not logged In"
  email.value = ""
*/
}

// 💡 修正：受け取った関数を実行してダイアログを開く
const login = () => {
  if (openLoginDialog) {
    openLoginDialog()
  }
}
</script>
