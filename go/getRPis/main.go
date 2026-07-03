package main

import (
	"bytes"
	"fmt"
	"os/exec"
	"strings"
)

// PiNode はネットワーク内で発見された Raspberry Pi の情報を格納します
type PiNode struct {
	Host string
	IP   string
}

// DiscoverPis は 1秒以下でネットワーク内のラズパイを探索し、リストを返します
func DiscoverPis() ([]PiNode, error) {
	// bash のジョブコントロールログを無効化し、出力を綺麗にするワンライナー
	cmdStr := `for i in $(seq 1 10); do suffix=$([ $i -eq 1 ] && echo "" || echo "-$i"); host="raspberrypi${suffix}.local"; (ip=$(ping -c 1 -W 1 $host 2>/dev/null | head -n 1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+'); [ -n "$ip" ] && echo "$host,$ip") & done; wait 2>/dev/null`

	cmd := exec.Command("bash", "-c", cmdStr)
	var stdout bytes.Buffer
	cmd.Stdout = &stdout

	if err := cmd.Run(); err != nil {
		return nil, err
	}

	var nodes []PiNode
	// 標準出力を行ごとに分割してパース
	lines := strings.Split(strings.TrimSpace(stdout.String()), "\n")
	for _, line := range lines {
		if line == "" {
			continue
		}
		parts := strings.Split(line, ",")
		if len(parts) == 2 {
			nodes = append(nodes, PiNode{
				Host: parts[0],
				IP:   parts[1],
			})
		}
	}

	return nodes, nil
}

func main() {
	nodes, err := DiscoverPis()
	if err != nil {
		fmt.Println("Error discovering nodes:", err)
		return
	}

	fmt.Printf("Discovered %d Raspberry Pi node(s):\n", len(nodes))
	for _, node := range nodes {
		fmt.Printf("👉 Host: %-20s | IP: %s\n", node.Host, node.IP)
	}
}
