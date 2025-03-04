// refer https://gist.github.com/tetkuz/f45e9fe26e9da84509db70631b14e2da
// https://docs.gtk.org/glib/struct.ByteArray.html
#include <string.h>
#include <glib.h>

int main()
{
	gchar *string = "message";
	GByteArray *array;
	guint8 *p;

	array = g_byte_array_new ();
	array = g_byte_array_append (array, (guint8 *)string, strlen(string));

	p = g_byte_array_free (array, FALSE);

	g_print ("%s\n", p);

	g_free (p);

	return 0;
}
