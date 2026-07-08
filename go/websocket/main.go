package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"math"
	"math/rand" // Go 1.20以降はシード不要で安全にランダムが使えます
	"time"

	"github.com/coder/websocket"
)

func main() {
	// 最初の接続テスト（タイムアウトつき）
	{
		// 1. 全体の処理のタイムアウトを30秒に設定（RPiの通信遅延対策）
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Minute)
		defer cancel()

		// 2. サーバーへ接続（Gorillaの Dial に相当）
		serverURL := "wss://connect-cf.gde00107.workers.dev"
		c, _, err := websocket.Dial(ctx, serverURL, nil)
		if err != nil {
			log.Fatalf("接続失敗: %v", err)
		}
		// 関数を抜けるときに安全にクローズする（Gorillaと違い原因コードと理由を添えられる）
		defer c.Close(websocket.StatusNormalClosure, "bye")

		fmt.Println("サーバーに接続しました。")

		// 3. メッセージの送信
		// Gorillaの c.WriteMessage(websocket.TextMessage, ...) に相当
		message := "Hello from RPi!"
		err = c.Write(ctx, websocket.MessageText, []byte(message))
		if err != nil {
			log.Fatalf("送信失敗: %v", err)
		}
		fmt.Printf("送信成功: %s\n", message)

		// 4. 返信の受信
		// Gorillaの c.ReadMessage() に相当（戻り値でメッセージタイプ、中身、エラーが取れる）
		msgType, p, err := c.Read(ctx)
		if err != nil {
			log.Fatalf("受信失敗: %v", err)
		}

		// 受信データを出力
		fmt.Printf("受信成功 (タイプ: %v): %s\n", msgType, string(p))
	}
	//
	// 本番のロングライフ接続
	//

	// アプリ全体の終了シグナル用（タイムアウトなし）
	mainCtx, cancelAll := context.WithCancel(context.Background())
	defer cancelAll()

	// 例: Ctrl+C などの終了イベントを待つゴルーチンをここで走らせて、
	// 終了時に cancelAll() を呼ぶようにします。

	// 指数バックオフ用の基本設定
	baseDelay := 2 * time.Second // 最初の待ち時間
	maxDelay := 10 * time.Minute // 最大でも10分までしか伸ばさない（それ以上は10分固定）
	attempt := 0                 // 連続失敗回数

	for {
		// mainCtx がすでにキャンセルされていないか事前にチェック
		if mainCtx.Err() != nil {
			break
		}

		fmt.Println("Cloudflare DO に接続を試みます...")
		serverURL := "wss://connect-cf.gde00107.workers.dev"

		c, _, err := websocket.Dial(mainCtx, serverURL, nil)
		if err != nil {
			log.Printf("接続失敗: %v", err)

			// 接続失敗（②のケース）なので、待ち時間を計算してスリープ
			attempt++
			delay := calculateDelay(baseDelay, maxDelay, attempt)

			fmt.Printf("接続に失敗しました。%v 後に再試行します (失敗回数: %d)\n", delay, attempt)

			// ★超重要: 単なる time.Sleep ではなく、スリープ中にアプリが終了したら即座に抜ける
			select {
			case <-time.After(delay):
				// 指定時間待てたので、次のループ（再接続）へ
				continue
			case <-mainCtx.Done():
				// 待っている最中に cancelAll() が呼ばれたのでループを抜ける
				fmt.Println("待機中にアプリ終了シグナルを受信しました。")
				break
			}
		}

		// --- ここに到達したということは、無事に接続成功！ ---
		fmt.Println("★接続成功しました！")
		attempt = 0 // 成功したので、失敗カウンターをリセット

		// メッセージ待ち受け無限ループ
		for {
			log.Println("[Goデバッグ] c.Read() でサーバーからのメッセージを待機中...")

			msgType, p, err := c.Read(mainCtx)
			if err != nil {
				// ① 自発的なキャンセル（アプリ終了）の場合
				if errors.Is(err, context.Canceled) {
					fmt.Println("【① アプリ終了】正常に終了します。")
					c.Close(websocket.StatusNormalClosure, "leaving")
					return
				}

				// ② 回線切れ、keep-alive失敗、DOからの切断
				log.Printf("【② 通信切断検出】: %v", err)
				c.Close(websocket.StatusAbnormalClosure, "abnormal")
				break // 内側のReadループを抜けて、外側の再接続ループへ戻る
			}

			log.Printf("[Goデバッグ] c.Read() を突破！ 受信データ: %s", string(p))

			// シグナリングが届いた時の処理（Pionへ流すなど）
			go handleSignaling(msgType, p)
		}
	}
}

// 指数バックオフの時間を計算する補助関数
func calculateDelay(base, max time.Duration, attempt int) time.Duration {
	// 2 ^ attempt を計算（オーバーフロー対策で、ある程度で頭打ちにする）
	if attempt > 30 {
		return max
	}

	// 1. 純粋な指数バックオフの計算 (base * 2^(attempt-1))
	factor := math.Pow(2, float64(attempt-1))
	delay := time.Duration(float64(base) * factor)

	if delay > max || delay < 0 {
		delay = max
	}

	// 2. ジッター（ゆらぎ）の追加
	// 計算された待ち時間の「±10%」の範囲でランダムに時間をずらす（Full Jitterの応用）
	// 例: 100秒待ちなら、90秒〜110秒の間に綺麗に分散させる
	jitterRange := int64(delay / 10) // 10%の幅を計算
	if jitterRange > 0 {
		// -10% 〜 +10% の間でランダムな時間を生成
		randomJitter := time.Duration(rand.Int63n(jitterRange*2) - jitterRange)
		delay = delay + randomJitter
	}

	// ゆらぎを足した結果、最大・最小を超えないように最終ガード
	if delay > max {
		return max
	}
	if delay < base {
		return base
	}
	return delay
}

func handleSignaling(msgType websocket.MessageType, payload []byte) {
	// Pion へのシグナリング中継ロジックをここに書く
	log.Println(string(payload))
}
