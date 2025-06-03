#ifndef FORM_URLENCODED_H
#define FORM_URLENCODED_H

#include <glib.h>

#define DESKTOP_MANAGER_HEIGHT 32 


// make hash table of request body.
GHashTable *
parse_form_urlencoded(const gchar *request_body);

void hash_table_func (
  gpointer key,
  gpointer value,
  gpointer user_data
);

#endif /* FORM_URLENCODED_H */