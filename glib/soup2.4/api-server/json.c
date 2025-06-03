#include <json-glib/json-glib.h>

void parse_and_dump_json(const gchar *request_body){
  // create parser
  g_autoptr(JsonParser) parser = json_parser_new ();
  g_autoptr(GError) error = NULL;

  // load data
  if (!json_parser_load_from_data(parser, (request_body), -1, &error)){
    g_warning ("Error running javascript: %s", error->message);
  }

  // create reader
  g_autoptr(JsonReader) reader = json_reader_new (json_parser_get_root (parser));

  // read name
  json_reader_read_member (reader, "name");
  const gchar *name = json_reader_get_string_value (reader); // shouldn't free
  g_message("name: %s", name);
  json_reader_end_member (reader);

  // read age
  json_reader_read_member (reader, "age");
  gint age = json_reader_get_int_value (reader);
  g_message("age: %d", age);
  json_reader_end_member (reader);

  // read email
  json_reader_read_member (reader, "email");
  const gchar *email = json_reader_get_string_value (reader); // shouldn't free
  g_message("email: %s", email);
  json_reader_end_member (reader);
}