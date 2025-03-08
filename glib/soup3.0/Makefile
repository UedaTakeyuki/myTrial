ALL     = simple-httpd simple-proxy unix-socket-client unix-socket-server dl-into-memory streaming-data get-asynchronousl

all: $(ALL)

%: %.c
	gcc $^ -o $@ `pkg-config --cflags --libs glib-2.0 libsoup-3.0 gtk+-3.0`

clean:
	rm $(ALL) 
