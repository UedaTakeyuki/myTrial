package main

import (
	"log"
	"log/slog"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lmicroseconds | log.Lshortfile)
	slog.Info("hello", "id", 100)
}
