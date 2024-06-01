package main

import (
	"log"
	"log/slog"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lmicroseconds | log.Lshortfile)
	log.Println("けろよん")
	slog.Info("hello", "id", 100)
}
