SRCS    = src/main.c src/screensize/*.c src/window/*.c src/window/widgets/*.c \
          src/experimentals/*.c
HDRS    = src/screensize/*.h src/window/*.h  src/window/widgets/*.h \
          src/experimentals/*.h
ALL     = $(SRCS) $(HDRS) 

clock: $(ALL)
	# $@ target name
	# $< the first name of dependency
	# $^ all dependencies of the target
	# https://tex2e.github.io/blog/makefile/automatic-variables
	gcc $(SRCS) -g -pg `pkg-config --cflags --libs gtk+-3.0` -o $@
