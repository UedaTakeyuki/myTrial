#include <glib.h>
#include "screensize.h" // RPi screen size
#include <stdio.h> // printf

struct width_height *getScreenSize(){
    gchar* contents;
    gsize  length;
    GError* error;

    g_file_get_contents (
        "/sys/class/graphics/fb0/virtual_size",
        &contents,
        &length,
        &error
    );
    gchar **sizeArray = g_strsplit (contents, ",", 2);
    struct width_height *wh = g_malloc(sizeof(struct width_height));
    wh->width = g_ascii_strtoll(sizeArray[0], NULL, 10);
    wh->height = g_ascii_strtoll(sizeArray[1], NULL, 10);
    printf("width: %d\n", wh->width);
    printf("hight: %d\n", wh->height);

    return wh;
}
