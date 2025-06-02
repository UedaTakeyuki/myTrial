%: %.c
	gcc $^ -o $@ `pkg-config --cflags --libs glib-2.0 libsoup-2.4`

clean:
	rm get simple-httpd simple-proxy escape
