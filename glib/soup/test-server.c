#include <libsoup/soup.h>

// refer https://gist.github.com/tetkuz/f45e9fe26e9da84509db70631b14e2da
static void
server_callback (SoupServer        *server,
                 SoupServerMessage *msg,
	             const char        *path,
                 GHashTable        *query,
		         gpointer           user_data){

    // Message Body
    SoupMessageBody *mbody = soup_server_message_get_request_body (msg);
    g_message("Message Body: %s", mbody->data);

    // make response.
    gchar *string = "hello"; // message string
    g_autoptr(GByteArray) body; // message body

    body = g_byte_array_new ();
    body = g_byte_array_append (body, (guint8 *)string, strlen(string));

    // response respound.
    soup_server_message_set_status (msg, SOUP_STATUS_OK, NULL);
    soup_server_message_set_response (msg, "text/html", SOUP_MEMORY_COPY,
                                      body->data, body->len);
//    g_byte_array_unref (body);
}

int main (int argc, char **argv){
    GMainLoop *loop;
    static int port = 8080;
    SoupServer *server;
    GError *error = NULL;

    server = soup_server_new ("server-header", "simple-httpd ", NULL);
    soup_server_listen_all (server, port, 0, &error);

    soup_server_add_handler (server, NULL, server_callback, NULL, NULL);
    loop = g_main_loop_new (NULL, TRUE);
    g_main_loop_run (loop);

    return 0;
}
