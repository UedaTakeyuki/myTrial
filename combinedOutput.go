package main

import (
	"log"
	"os/exec"
	"time"
)

func main() {
	var out []byte
	var err error
	for len(out) < 1 {
		cmd := exec.Command("sh", "-c", "echo aho")
		if out, err = cmd.CombinedOutput(); err != nil {
			log.Println(err)
		} else {
			log.Println(string(out))
		}
		time.Sleep(time.Second)
	}
}
