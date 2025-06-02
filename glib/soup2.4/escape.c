#include <glib.h>
#include <stdio.h>
int
main (int argc, char **argv) {

  // unescaped string
  gchar *unescaped_string= "name=John+-_&email=john@example.comアホ";
  printf("unescaped_string: %s\n",unescaped_string);

  // escape
  gchar *escaped_string=g_uri_escape_string (
    /* const char* unescaped */ unescaped_string,
    /* const char* reserved_chars_allowed */ NULL,
    /* gboolean allow_utf8 */ FALSE
  );
  printf("escaped_string: %s\n",escaped_string);

  // unescape again
  gchar * reunescaped_string=g_uri_unescape_string (
    /* const char* escaped_string */ escaped_string,
    /* const char* illegal_characters */NULL
  );
  printf("reunescaped_string: %s\n",reunescaped_string);
}