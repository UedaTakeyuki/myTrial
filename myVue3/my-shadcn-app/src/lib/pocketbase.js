import PocketBase from 'pocketbase'

// アプリ全体で使い回す唯一のインスタンスを作成
const pb = new PocketBase('https://pocketbase.uedasoft.com');

// 💡 自動キャンセルを無効化する
pb.autoCancellation(false);

export default pb;