SRCS    = main.c
HDRS    = 
ALL     = $(SRCS) $(HDRS) 

soup: $(ALL)
	# $@ target name
	# $< the first name of dependency
	# $^ all dependencies of the target
	# https://tex2e.github.io/blog/makefile/automatic-variables
	gcc $(SRCS) -g -pg `pkg-config --cflags --libs libsoup-2.4 gtk+-3.0 json-glib-1.0` -o $@
