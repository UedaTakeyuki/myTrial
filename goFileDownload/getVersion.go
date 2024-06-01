package main

import (
  "os/exec"
  "log"
)

func main(){

  if out, err := exec.Command("./yt-dlp", "--version").Output(); err != nil {
    log.Println(err)
  } else {
    log.Println(string(out))
  }
}
