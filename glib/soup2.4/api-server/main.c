#include <libsoup/soup.h>
#include "form-urlencoded.h"

// refer https://gist.github.com/tetkuz/f45e9fe26e9da84509db70631b14e2da
static void
server_callback (SoupServer        *server,
                 SoupMessage       *msg,
                 const gchar       *path,
                 GHashTable        *query,
                 SoupClientContext *client,
		         gpointer           user_data){

    const gchar *content_type = soup_message_headers_get_content_type (msg->request_headers, NULL); // shouldn't free
    g_message("Method: %s", msg->method);
    g_message("Content type: %s", content_type);
//              soup_message_headers_get_content_type (msg->request_headers, NULL));
    g_message("Request Body: %s", msg->request_body->data);

    if (content_type != NULL){
        if (g_str_equal(content_type, "application/x-www-form-urlencoded")){
            g_message("Form-URLEncoded:");
            g_autoptr(GHashTable) form = parse_form_urlencoded(msg->request_body->data);
            g_message("length %d",g_hash_table_size (form));
            g_hash_table_foreach(form, hash_table_func, NULL);
            g_message("name: %s", g_hash_table_lookup(form, "name"));
            
        } else if (g_str_equal(content_type, "application/json")){
            g_message("JSON:");
        } else if (g_str_equal(content_type, "multipart/form-data")) {
            g_message("Multipart/Form-data:");
            g_autoptr(SoupMultipart) multipart
            = soup_multipart_new_from_message (/*SoupMessageHeaders *headers*/ msg->request_headers,
                                    /*SoupMessageBody *body*/ msg->response_body);
            gint multipart_length = soup_multipart_get_length(multipart);
            g_message("Multipart length: %d", multipart_length);
        }
    }

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
