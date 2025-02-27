#include <libsoup/soup.h>

static void on_load_callback (GObject *source, GAsyncResult *result, gpointer user_data)
{
    GMainLoop *loop = user_data;
    GError *error = NULL;
    GBytes *bytes = soup_session_send_and_read_finish (SOUP_SESSION (source), result, &error);

    // Usage here is the same as before
    if (error) {
        g_error_free (error);
    } else {
        g_bytes_unref (bytes);
    }

    g_main_loop_quit (loop);
}

int main (int argc, char **argv)
{
    SoupSession *session = soup_session_new ();
    GMainLoop *loop = g_main_loop_new (NULL, FALSE);
    SoupMessage *msg = soup_message_new (SOUP_METHOD_GET, "https://upload.wikimedia.org/wikipedia/commons/5/5f/BBB-Bunny.png");

    soup_session_send_and_read_async (
        session,
        msg,
        G_PRIORITY_DEFAULT,
        NULL,
        on_load_callback,
        loop);

    g_main_loop_run (loop);

    g_main_loop_unref (loop);
    g_object_unref (msg);
    g_object_unref (session);
    return 0;
}
