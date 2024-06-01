package main

import (
    "io"
    "net/http"
    "os"
)

func main() {
    // https://stackoverflow.com/a/11693049/11073131

    fileUrl := "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp"
    if err := DownloadFile("yt-dlp", fileUrl); err != nil {
        panic(err)
    }
    if err := os.Chmod("yt-dlp", 0775); err != nil {
        panic(err)
    }
}

func DownloadFile(filepath string, url string) error {
//  https://stackoverflow.com/a/11693049/11073131
    resp, err := http.Get(url)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    out, err := os.Create(filepath)
    if err != nil {
        return err
    }
    defer out.Close()

    _, err = io.Copy(out, resp.Body)
    return err
}

