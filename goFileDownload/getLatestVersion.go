// https://qiita.com/isaka1022/items/d3f41f99d820ebddac61
// https://stackoverflow.com/a/38150816/11073131
package main

import (
	"fmt"
	"log"
	"net/http"
//	"os"
)

func main() {
	targetUrl := "https://github.com/yt-dlp/yt-dlp/releases/latest"
	c := &http.Client{
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}
	resp, err := c.Get(targetUrl)
	if err != nil {
		log.Println(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == 302 {
		fmt.Println(resp.Header["Location"][0])
	}
}
