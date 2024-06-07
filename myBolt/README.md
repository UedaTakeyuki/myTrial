# Performance
```
pi@raspberrypi:~/github/myTrial/myBolt $ uname -a
Linux raspberrypi 5.10.103-v7+ #1529 SMP Tue Mar 8 12:21:37 GMT 2022 armv7l GNU/Linux
pi@raspberrypi:~/github/myTrial/myBolt $ python -m getrpimodel
2 Model B
pi@raspberrypi:~/github/myTrial/myBolt $ go run *.go
2024/06/07 11:33:31 Update
2024/06/07 11:33:31 eraps main.main.func1: 294 μs
2024/06/07 11:33:31 View
Hello World!
2024/06/07 11:33:31 eraps main.main.func2: 158 μs
2024/06/07 11:33:31 bolt.DB{path:"./bolt.db"}
2024/06/07 11:33:31 &{1991180288 4096}
2024/06/07 11:33:31 Status
2024/06/07 11:33:31 {0 0 0 0 2 1 0 0 0 0 1 1 98}
2024/06/07 11:33:31 Delete
2024/06/07 11:33:31 eraps main.main.func3: 90 μs
2024/06/07 11:33:31 eraps main.main.func3: 430 μs
2024/06/07 11:33:31 key1
2024/06/07 11:33:31 eraps main.main.func4: 209 μs
2024/06/07 11:33:31 eraps main.main.func5: 139 μs
2024/06/07 11:33:32 key2
2024/06/07 11:33:32 eraps main.main.func4: 284 μs
2024/06/07 11:33:32 eraps main.main.func5: 130 μs
2024/06/07 11:33:33 key3
2024/06/07 11:33:33 eraps main.main.func4: 197 μs
2024/06/07 11:33:33 eraps main.main.func5: 154 μs
2024/06/07 11:33:34 key4
2024/06/07 11:33:34 eraps main.main.func4: 192 μs
2024/06/07 11:33:34 eraps main.main.func5: 157 μs
2024/06/07 11:33:35 key5
2024/06/07 11:33:35 eraps main.main.func4: 183 μs
2024/06/07 11:33:35 eraps main.main.func5: 157 μs
2024/06/07 11:33:36 key6
2024/06/07 11:33:36 eraps main.main.func4: 186 μs
2024/06/07 11:33:36 eraps main.main.func5: 333 μs
```

- func1: Update()
- func2: View()
- func3:
- func4:
- func5:
