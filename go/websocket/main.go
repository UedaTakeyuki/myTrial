package main

import (
	"context"
	"fmt"
	"log"
	"time"
	"errors"

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

	// 1. アプリ全体が終了するときだけキャンセルされる ctx（タイムアウトなし）
	mainCtx, cancelAll := context.WithCancel(context.Background())
	defer cancelAll()

	// ※ ここで SIGINT (Ctrl+C) などのシステム終了イベントを受け取ったら 
	// cancelAll() を呼ぶようにしておくと、安全に終了できます。

	// 接続処理...
	c, _, err := websocket.Dial(mainCtx, "wss://connect-cf.gde00107.workers.dev", nil)
	if err != nil {
		log.Fatalf("接続失敗: %v", err)
	}


	// 2. 指令を何ヶ月も待ち続ける無限ループ
	for {
		// Read には「全体の寿命」である mainCtx をそのまま渡す。
		// これにより、何ヶ月もデータが来なくても、接続が生きている限りここでじっと待ち続けます。
		msgType, p, err := c.Read(mainCtx)
		log.Println("msgType", msgType)
		log.Println("p", p)

		if err != nil {
			// 判定①：自分自身（アプリ側）で cancelAll() を呼んで終了した場合
			if errors.Is(err, context.Canceled) {
				fmt.Println("【① アプリ終了】自発的なキャンセルにより、正常に待機を終了しました。")
				return
			}

			// 判定②：それ以外（回線切れ、DOからの切断、keep-alive失敗など）
			
			// さらに詳しく「WebSocketレベルのクローズ」かどうかを調べる場合
			var ce websocket.CloseError
			if errors.As(err, &ce) {
				fmt.Printf("【② WebSocket切断】コード %v (理由: %s) で切断されました。\n", ce.Code, ce.Reason)
			} else {
				// Ping/Pong（keep-alive）の失敗、ネットワークの瞬断、LAN抜けなどはここに落ちます
				fmt.Printf("【② ネットワーク異常】物理的な切断またはkeep-alive失敗: %v\n", err)
			}
			
			// ここで「再接続ロジック（リトライ）」へ進む
			return		
		}

		// 指令（WebRTCのオファー）が届いたので Pion に流す
		// go handleSignaling(p)
	}
}
