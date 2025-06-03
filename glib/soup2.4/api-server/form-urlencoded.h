#ifndef FORM_URLENCODED_H
#define FORM_URLENCODED_H

#include <glib.h>

// make hash table of request body.
GHashTable *
parse_form_urlencoded(const gchar *request_body);

void dump_table(GHashTable *table);

#endif /* FORM_URLENCODED_H */