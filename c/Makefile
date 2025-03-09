ALL = simplest

all: $(ALL)

%: %.c
	gcc $^ -o $@ `curl-config --libs` `pkg-config --cflags --libs glib-2.0`

clean:
	rm $(ALL) 
