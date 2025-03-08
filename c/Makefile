ALL = simplest

all: $(ALL)

%: %.c
	gcc $^ -o $@ `curl-config --libs`

clean:
	rm $(ALL) 
