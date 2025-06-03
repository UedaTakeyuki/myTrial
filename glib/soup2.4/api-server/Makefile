SRCS    = *.c
HDRS    = *.h
ALL     = $(SRCS) $(HDRS) 

server: $(ALL)
	gcc $(SRCS) -g -pg `pkg-config --cflags --libs glib-2.0 json-glib-1.0 libsoup-2.4` -o $@

clean:
	rm server
