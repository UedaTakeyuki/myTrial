SRCS    = main.c

main: $(SRCS)
	gcc -g  -pg `pkg-config --cflags --libs gtk+-3.0 webkit2gtk-4.0` -o $@ $(SRCS)
