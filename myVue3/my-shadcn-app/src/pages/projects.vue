<!-- src/pages/projects.vue -->
<template>
  <div class="space-y-8 py-6 animate-in fade-in duration-500">
    
    <!-- ページヘッダー情報 -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <!-- 💡 修正：text-zinc-100 -> text-foreground -->
        <h1 class="text-3xl font-black tracking-tight text-foreground">Projects</h1>
        <!-- 💡 修正：text-zinc-400 -> text-muted-foreground -->
        <p class="text-muted-foreground text-sm">現在進行中のプロジェクトとステータスの一覧です。</p>
      </div>
      <!-- 新規作成ボタン（プライマリカラーを自動適用） -->
      <!-- 💡 修正：bg-primary などのセマンティックカラーに変更。影の色も調整。 -->
      <Button class="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-lg shadow-primary/10">
        <Plus class="h-4 w-4 mr-2" />
        New Project
      </Button>
    </div>

    <!-- グリッドレイアウトでカードを綺麗に並べる -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      
      <!-- ループ処理でサンプルデータをカード展開 -->
      <!-- 💡 修正：bg-card, border-border を使い、ホバー時の影もライト/ダーク両方に対応 -->
      <Card 
        v-for="project in projects" 
        :key="project.id" 
        class="bg-card text-card-foreground border-border/80 hover:border-indigo-500/50 backdrop-blur-sm transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-zinc-950/50"
      >
        <CardHeader class="flex flex-row items-start justify-between space-y-0 pb-3">
          <div class="space-y-1">
            <!-- 💡 修正：text-zinc-100 を削除（デフォルトで text-card-foreground になります） -->
            <CardTitle class="text-lg font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {{ project.name }}
            </CardTitle>
            <!-- 💡 修正：text-zinc-400 -> text-muted-foreground -->
            <CardDescription class="text-muted-foreground text-xs">
              Updated {{ project.updatedAt }}
            </CardDescription>
          </div>
          <!-- 状況に応じたカラーバッジ -->
          <Badge :class="getStatusClass(project.status)">
            {{ project.status }}
          </Badge>
        </CardHeader>
        
        <CardContent class="pb-4">
          <!-- 💡 修正：text-zinc-400 -> text-muted-foreground -->
          <p class="text-muted-foreground text-sm leading-relaxed">
            {{ project.description }}
          </p>
        </CardContent>

        <!-- 💡 修正：border-zinc-800/50 -> border-border/50, text-zinc-500 -> text-muted-foreground -->
        <CardFooter class="border-t border-border/50 pt-4 flex items-center justify-between text-xs text-muted-foreground">
          <!-- 💡 修正：text-zinc-400 -> text-foreground (技術タグを少し強調) -->
          <span class="font-medium text-foreground/80">{{ project.tech }}</span>
          <!-- 💡 修正：text-zinc-400 -> text-muted-foreground -->
          <Button variant="link" class="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 p-0 h-auto">
            View details →
          </Button>
        </CardFooter>
      </Card>

    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus } from 'lucide-vue-next'

// サンプルのプロジェクトデータ
const projects = [
  {
    id: 1,
    name: 'E-Commerce Platform',
    description: 'Shadcn と Vue 3 をフル活用した次世代型オンラインストア。高速なモック決済システムを内蔵。',
    status: 'In Progress',
    updatedAt: '2 hours ago',
    tech: 'Vue 3 / Tailwind'
  },
  {
    id: 2,
    name: 'AI Analytics Dashboard',
    description: 'データ解析とAIによる予測トレンドを視覚化する管理画面。Pythonバックエンドと連携中。',
    status: 'Completed',
    updatedAt: '1 day ago',
    tech: 'Nuxt / Python'
  },
  {
    id: 3,
    name: 'Mobile Core Engine',
    description: 'iOS/Androidアプリ用の超軽量同期エンジン。現在プロトタイプの検証コードを執筆中。',
    status: 'Review',
    updatedAt: '3 days ago',
    tech: 'TypeScript / Rust'
  }
]

// 💡 追加：ステータスに応じたバッジのクラスをライト/ダーク両方に対応して出し分ける関数
const getStatusClass = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
    case 'In Progress':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
    case 'Review':
      return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
    default:
      return 'bg-secondary text-secondary-foreground'
  }
}
</script>
