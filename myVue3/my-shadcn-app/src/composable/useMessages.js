// composables/useMessages.js
import { ref, onUnmounted } from 'vue'
import pb from '@/lib/pocketbase'

// 💡 ブラウザのHTTPS制限を受けない、安全な軽量MD5実装
function md5(string) {
  function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17,  606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12,  1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7,  1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7,  1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22,  1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14,  643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9,  38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5,  568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20,  1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14,  1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16,  1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11,  1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4,  681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23,  76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16,  530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10,  1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6,  1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6,  1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21,  1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15,  718787281);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
  }
  function cmn(q, a, b, x, s, t) { return add32(rotl(add32(add32(a, q), add32(x, t)), s), b); }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function md51(s) {
    var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i, tail, blocks, nblocks, c = [];
    for (i = 0; i < n; i++) c[i] = s.charCodeAt(i);
    tail = n % 64; nblocks = (n - tail) / 64;
    if (tail < 56) { c[n] = 128; for (i = n + 1; i < nblocks * 64 + 56; i++) c[i] = 0; }
    else { c[n] = 128; for (i = n + 1; i < nblocks * 64 + 120; i++) c[i] = 0; nblocks++; }
    blocks = [];
    for (i = 0; i < nblocks * 16; i++) blocks[i] = c[i * 4] | (c[i * 4 + 1] << 8) | (c[i * 4 + 2] << 16) | (c[i * 4 + 3] << 24);
    for (i = 0; i < nblocks; i++) md5cycle(state, blocks.slice(i * 16, (i + 1) * 16));
    return state;
  }
  function rhex(n) { var s = '', j; for (j = 0; j <= 3; j++) s += hex_chr[(n >> (j * 8 + 4)) & 15] + hex_chr[(n >> (j * 8)) & 15]; return s; }
  var hex_chr = '0123456789abcdef'.split('');
  function h1(s) { var i, a = md51(s); for (i = 0; i < 4; i++) a[i] = rhex(a[i]); return a.join(''); }
  function add32(x, y) { return (x + y) & 4294967295; }
  function rotl(x, y) { return (x << y) | (x >>> (32 - y)); }
  return h1(string.trim().toLowerCase());
}

export function useMessages() {
  const records = ref([])
  const avatarUrls = ref({})
  const isSending = ref(false)
  const currentUserId = pb.authStore.record?.id || ''

  // アバターURLの読み込み（単一ユーザー用）
  const loadSingleAvatarUrl = (user) => {
    if (user?.email && !avatarUrls.value[user.id]) {
      // 💡 同期型の自前 md5 関数を使うため、await が不要になり処理も高速化！
      const hash = md5(user.email)
      avatarUrls.value[user.id] = `https://gravatar.com/avatar/${hash}?d=identicon&s=150`
    }
  }

  // メッセージ一括取得
  const fetchMessages = async () => {
    const data = await pb.collection('messages').getFullList({
      sort: '-created',
      expand: 'user_from,user_to',
      requestKey: null
    })
    records.value = data.reverse()
    
    for (const msg of records.value) {
      loadSingleAvatarUrl(msg.expand?.user_from)
    }
  }

// 💡 useMessages.js 内の subscribeMessages を以下に丸ごと差し替えてください

const subscribeMessages = async (onNewMessageReceived) => {
  // ⚠️ subscribe 自体の多重登録による不具合を防ぐため、一度クリアしてから登録するのが安全です
  await pb.collection('messages').unsubscribe('*')

  await pb.collection('messages').subscribe('*', async ({ action, record }) => {
    if (action === 'create') {
      try {
        console.log("【リアルタイムイベント検知】新着レコードID:", record.id)

        // 💡 対策①: 画像のアップロード完了とDB反映の超わずかな時間差を埋めるため、一瞬待つ
        await new Promise(resolve => setTimeout(resolve, 250));

        // 💡 対策②: requestKey: null を最優先で指定し、PocketBase SDKの「自動キャンセル機能」を完全に無効化する！！
        const freshRecord = await pb.collection('messages').getOne(record.id, {
          expand: 'user_from,user_to',
          requestKey: null // 👈 これが最重要！SDKによる勝手なリクエスト破棄を防ぎます
        })

        console.log("【データ取得成功】新着メッセージを展開しました:", freshRecord)

        // アバターURLの読み込み
        loadSingleAvatarUrl(freshRecord.expand?.user_from)
        
        // 配列の重複追加を防止
        if (!records.value.some(r => r.id === freshRecord.id)) {
          records.value.push(freshRecord)
        }

        // コールバック関数（通知音・スクロールなど）を実行
        if (onNewMessageReceived) onNewMessageReceived()

      } catch (error) {
        // ⚠️ 自動キャンセルが発動していた場合、ここに「autocancelled」というエラーが引っかかります
        console.error("【リアルタイム同期エラー】データ取得に失敗しました:", error);
        
        // 💡 対策③: 万が一キャンセルされた場合のリトライ処理（ここでも requestKey: null を付与）
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const retryRecord = await pb.collection('messages').getOne(record.id, {
            expand: 'user_from,user_to',
            requestKey: null
          });
          loadSingleAvatarUrl(retryRecord.expand?.user_from);
          if (!records.value.some(r => r.id === retryRecord.id)) {
            records.value.push(retryRecord);
          }
          if (onNewMessageReceived) onNewMessageReceived();
          console.log("【リトライ成功】遅延同期が完了しました。");
        } catch (finalError) {
          console.error("【リトライ失敗】新着メッセージの取得が完全に遮断されました:", finalError);
        }
      }
    }
    
    if (action === 'delete') {
      records.value = records.value.filter(r => r.id !== record.id)
    }
  })
}

  // 同期解除
  const unsubscribeMessages = () => {
    pb.collection('messages').unsubscribe('*')
  }

  // 💡 useMessages.js 内の sendMessage を以下に差し替え

  // ⭕ 第3引数の変数名を「targetId」に統一します
  const sendMessage = async (text, file = null, targetId = '') => {
    isSending.value = true
    try {
      // FormDataオブジェクトを作成
      const formData = new FormData()
      
      // テキストが存在すれば追加
      if (text && text.trim() !== '') {
        formData.append('message', text)
      }
      
      // 送信者のユーザーIDを追加（文字列変数）
      formData.append('user_from', currentUserId) 

      // 💡 修正：引数名に合わせて「targetId」を正しく user_to に追加
      if (targetId) {
        // もし配列（複数）で届いた場合も考慮して、文字列として安全に追加
        formData.append('user_to', String(targetId))
      }
      
      // 1枚のクリーンな File オブジェクトとして FormData に結合
      if (file) {
        formData.append('file', file)
      }

      console.log("【API通信直前】PocketBaseにFormDataを送信します。")
      
      // PocketBaseへ送信して作成
      const result = await pb.collection('messages').create(formData)
      console.log("【API通信成功】サーバーに保存完了:", result)
      
      return true
    } catch (error) {
      // ⚠️ ここでアラートを出していたため、内部の変数エラーをそのままポップアップさせてしまっていました
      alert("【PocketBase送信エラー】\n" + (error.message || JSON.stringify(error)))
      console.error('送信エラーの詳細:', error)
      return false
    } finally {
      isSending.value = false
    }
  }
  
  onUnmounted(() => {
    unsubscribeMessages()
  })

  return {
    records,
    avatarUrls,
    isSending,
    currentUserId,
    fetchMessages,
    subscribeMessages,
    sendMessage
  }
}
