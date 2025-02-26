#include <libsoup/soup.h>

int main (int argc, char **argv)
{
    SoupSession *session = soup_session_new ();
    SoupMessageHeaders *response_headers;
    const char *content_type;
    goffset content_length;
    SoupMessage *msg = soup_message_new (SOUP_METHOD_GET, "https://upload.wikimedia.org/wikipedia/commons/5/5f/BBB-Bunny.png");
    GError *error = NULL;
    GInputStream *in_stream = soup_session_send (
        session,
        msg,
        NULL,
        &error);

    if (error) {
        g_printerr ("Failed to download: %s\n", error->message);
        g_error_free (error);
        g_object_unref (msg);
        g_object_unref (session);
        return 1;
    }

    GFile *output_file = g_file_new_tmp ("BBB-Bunny-XXXXXX.png");
    GOutputStream *out_stream = g_file_create (output_file,
        G_FILE_CREATE_NONE, NULL, &error);

    if (error) {
        g_printerr ("Failed to create file \"%s\": %s\n",
                    g_file_peek_path (output_file), error->message);
        g_error_free (error);
        g_object_unref (output_file);
        g_object_unref (in_stream);
        g_object_unref (msg);
        g_object_unref (session);
        return 1;
    }

    response_headers = soup_message_get_response_headers (msg);
    content_type = soup_message_headers_get_content_type (response_headers);
    content_length = soup_message_headers_get_content_length (response_headers);

    // content_type = "image/png"
    g_print ("Downloading %zu bytes of type %s to %s\n",
             content_length, content_type,
             g_file_peek_path (output_file));

    g_output_stream_splice (out_stream, in_stream,
        G_OUTPUT_STREAM_SPLICE_CLOSE_SOURCE | G_OUTPUT_STREAM_SPLICE_CLOSE_TARGET,
        NULL, &error);

    if (error) {
        g_print ("Download failed: %s\n", error->message);
        g_error_free (error);
    } else {
        g_print ("Download completed\n");
    }

    g_object_unref (output_file);
    g_object_unref (in_stream);
    g_object_unref (out_stream);
    g_object_unref (msg);
    g_object_unref (session);
    return error ? 1 : 0;
}
