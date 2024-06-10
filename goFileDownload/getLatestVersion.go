// https://qiita.com/isaka1022/items/d3f41f99d820ebddac61
// https://stackoverflow.com/a/38150816/11073131
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
)

func main() {
	targetUrl := "https://github.com/" + os.Args[1] + "/" + os.Args[2] + "/releases/latest"
	//	targetUrl := "https://github.com/yt-dlp/yt-dlp/releases/latest"
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

	//	fmt.Println(resp.StatusCode)
	if resp.StatusCode == 404 {
		fmt.Println("No release")
	} else if resp.StatusCode == 302 {
		redirectURL := resp.Header["Location"][0]
		urlArray := strings.Split(redirectURL, "/")
		fmt.Println(urlArray[len(urlArray)-1])
		//		fmt.Println(resp.Header["Location"][0])
	}
}
