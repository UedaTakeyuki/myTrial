package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/coder/websocket"
)

func main() {
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
