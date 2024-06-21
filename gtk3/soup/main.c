#include <libsoup/soup.h>
#include <json-glib/json-glib.h>

//https://libsoup.org/libsoup-2.4/libsoup-client-howto.html
int main(int argc, char *argv[])
{
  SoupMessage *msg;
  msg = soup_message_new ("GET", "https://www.tokyu.co.jp/unten/unten2.json");
  SoupSession *session = soup_session_sync_new();
  guint status = soup_session_send_message (session, msg);
  printf("status: %d\n", status);
  printf("body: %s", msg->response_body->data);

  JsonParser *parser = json_parser_new ();
  GError *error;

  // +3 means remove bom
  if (!json_parser_load_from_data(parser, (msg->response_body->data)+3, -1, &error)){
    g_warning ("Error running javascript: %s", error->message);
    g_error_free (error);
  }
  g_autoptr(JsonReader) reader = json_reader_new (json_parser_get_root (parser));
  json_reader_read_member (reader, "unten");
  const char *url = json_reader_get_string_value (reader);
  printf("unten: %s \n", url);
/*
  JsonNode *result;
  JsonPath *path = json_path_new ();
  json_path_compile (path, "$.unten", NULL);
  result = json_path_match (path, json_parser_get_root (parser));


  JsonGenerator *generator = json_generator_new ();
  json_generator_set_root (generator, result);
  char *str = json_generator_to_data (generator, NULL);
  g_print ("Results: %s\n", str);
*/

  g_object_unref(msg);
  g_object_unref(session);
}
