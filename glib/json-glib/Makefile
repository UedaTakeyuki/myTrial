ALL     = array \
          builder \
          generator gvariant \
          node    parser  render             serialize-full \
          boxed  invalid   object  path    serialize-complex  serialize-simple

all: $(ALL)

%: %.c
	gcc $^ -o $@ `pkg-config --cflags --libs glib-2.0 json-glib-1.0`

clean:
	rm $(ALL)
