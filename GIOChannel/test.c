#include <glib.h>
 
int
main(int argc, char* argv[]) {
 
    GIOChannel* channel;
    GError*     error = NULL;
    gchar*      str;
    gsize       length;
#if !GLIB_CHECK_VERSION (2,35,0)
    g_type_init ();
#endif
    channel = g_io_channel_new_file("test.c", "r", &error);
    if (error)
    {
        g_warning (error->message);
        g_error_free (error);
        return 1;
    }
    g_io_channel_read_to_end(channel, &str, &length, &error);
    if (error)
    {
        g_warning (error->message);
        g_error_free (error);
        g_io_channel_unref(channel);
        return 1;
    }
    g_printf(str);
 
    g_free(str);
    g_io_channel_unref(channel);
    return 0;
}
