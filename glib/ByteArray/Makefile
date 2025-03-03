ALL     = main

all: $(ALL)

%: %.c
	gcc $^ -o $@ `pkg-config --cflags --libs glib-2.0 libsoup-3.0 gtk+-3.0`

clean:
	rm $(ALL) 
