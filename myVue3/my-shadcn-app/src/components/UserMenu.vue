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
          <p class="text-sm font-medium leading-none text-foreground">shadcn</p>
          <p class="text-xs leading-none text-muted-foreground">m@example.com</p>
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
      <DropdownMenuItem class="text-destructive font-medium focus:bg-destructive/10 focus:text-destructive">
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>


<script setup>
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
</script>
