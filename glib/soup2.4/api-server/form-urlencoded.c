#include <glib.h>

GHashTable *
parse_form_urlencoded(const gchar *request_body){
  GHashTable *form = g_hash_table_new (
    /* GHashFunc hash_func */ g_str_hash,
    /* GEqualFunc key_equal_func */ g_str_equal
  );
  return form;
}