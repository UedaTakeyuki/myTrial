<script setup>
import pb from '@/lib/pocketbase'
import { onMounted } from 'vue'

// 1. データの作成 (Create)
async function createData() {
    const data = {
        "title": "新しいタスク",
        "status": "pending"
    };
    
    // "example_collection" は作成したコレクション名
    const record = await pb.collection('example_collection').create(data);
    console.log('作成完了:', record);
}

// 2. データの取得 (Read) - リスト
async function getList() {
    // ページ番号(1から)、1ページの件数
    const records = await pb.collection('example_collection').getList(1, 50, {
        filter: 'title = "🐸ケロケロタイトル🐸"', // コレクションにあるフィールド名に変更
        sort: '-created'              // ソート順（作成日降順）
    });
    console.log('取得リスト:', records);
}

onMounted(()=>{
  createData()
  getList()
})

</script>