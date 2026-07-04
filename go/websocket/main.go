package main

import (
	"log"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/websocket"
)

func main() {
	// 割り込みシグナル（Ctrl+C）を検知するためのチャンネル
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	// WebSocketサーバーのURL
	url := "wss://durable-object-starter.gde00107.workers.dev"
	log.Printf("接続中: %s", url)

	// サーバーへ接続
	c, _, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		log.Fatal("ダイアルエラー:", err)
	}
	defer c.Close()

	// サーバーからのメッセージを読み取るゴルーチン
	done := make(chan struct{})
	go func() {
		defer close(done)
		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				log.Println("読み取りエラー:", err)
				return
			}
			log.Printf("受信: %s", message)
		}
	}()

	// サーバーへメッセージを送信する処理
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-done:
			return
		case t := <-ticker.C:
			msg := "こんにちは！ 現在時刻: " + t.String()
			err := c.WriteMessage(websocket.TextMessage, []byte(msg))
			if err != nil {
				log.Println("書き込みエラー:", err)
				return
			}
		case <-interrupt:
			log.Println("割り込みを検知しました。切断します...")

			// 接続を閉じるために close メッセージを送信
			err := c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
			if err != nil {
				log.Println("クローズメッセージ書き込みエラー:", err)
				return
			}
			
			// サーバーからのclose応答を待つか、タイムアウトを設定
			select {
			case <-done:
			case <-time.After(time.Second):
			}
			return
		}
	}
}
