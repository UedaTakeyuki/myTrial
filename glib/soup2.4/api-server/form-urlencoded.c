// To handle a request body which content-type is application/x-www-form-urlencoded
#include <glib.h>
#include <stdio.h>

// make hash table of request body.
GHashTable *
parse_form_urlencoded(const gchar *request_body){
  GHashTable *form = g_hash_table_new (
    /* GHashFunc hash_func */ g_str_hash,
    /* GEqualFunc key_equal_func */ g_str_equal
  );
  g_auto(GStrv) query_array = g_strsplit (request_body, "&", 0 /* split completely.*/);
  for (gint i=0; i < g_strv_length(query_array); i++){
    g_auto(GStrv) query = g_strsplit(query_array[i], "=", 0 /* split completely.*/);
    gchar *key = g_uri_unescape_string(query[0], NULL);    // shouldn't free, be part of hush table
    gchar *value = g_uri_unescape_string(query[1], NULL);  // shouldn't free, be part of hush table

    g_hash_table_insert (
      /* GHashTable* hash_table */ form,
      /* gpointer key */ key,
      /* gpointer value */ value
    );
  }
  return form;
}

// iterator function for debug dump
void hash_table_func (
  gpointer key,
  gpointer value,
  gpointer user_data
){
  g_message("key: %s", key);
  g_message("value: %s", value);
}