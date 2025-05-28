#include <libsoup/soup.h>

// refer https://gist.github.com/tetkuz/f45e9fe26e9da84509db70631b14e2da
static void
server_callback (SoupServer        *server,
                 SoupMessage       *msg,
                 const gchar       *path,
                 GHashTable        *query,
                 SoupClientContext *client,
		         gpointer           user_data){

    g_message("Method: %s", msg->method);
    g_message("Content type: %s", 
              soup_message_headers_get_content_type (msg->request_headers, NULL));
    g_message("Message Body: %s", msg->request_body->data);

    // make response.
    gchar *string = "hello"; // message string
    g_autoptr(GByteArray) body; // message body

    body = g_byte_array_new ();
    body = g_byte_array_append (body, (guint8 *)string, strlen(string));

    // send response.
    soup_message_set_status (msg, SOUP_STATUS_OK);
    soup_message_set_response (msg, "text/html", SOUP_MEMORY_COPY,
                                      body->data, body->len);
}

int main (int argc, char **argv){
    GMainLoop *loop;
    static int port = 8088;
    SoupServer *server;
    GError *error = NULL;

    server = soup_server_new ("server-header", "simple-httpd ", NULL);
    soup_server_listen_all (server, port, 0, &error);

    soup_server_add_handler (server, NULL, server_callback, NULL, NULL);
    loop = g_main_loop_new (NULL, TRUE);
    g_main_loop_run (loop);

    return 0;
}
