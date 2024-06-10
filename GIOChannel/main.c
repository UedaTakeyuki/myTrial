#include <glib.h>
static gboolean read_callback(GIOChannel *io, GIOCondition cond, gpointer user_data) {
  GMainLoop *loop = user_data;
  gboolean continue_to_watch = FALSE;
  if (cond & G_IO_IN) {
    GError *e = NULL;
    char *text;
    switch (g_io_channel_read_line(io, &text, NULL, NULL, &e)) {
    case G_IO_STATUS_NORMAL:
      g_message("%s: read line: %s", __func__, text);
      g_free(text);
      continue_to_watch = TRUE;
      break;
    case G_IO_STATUS_AGAIN:
      g_message("%s: AGAIN", __func__);
      continue_to_watch = TRUE;
      break;
    case G_IO_STATUS_ERROR:
      g_message("%s: error: %s", __func__, e->message);
      g_error_free(e);
      break;
    case G_IO_STATUS_EOF:
      g_message("%s: EOF", __func__);
      break;
    default:
      break;
    }
  }
  if (! continue_to_watch) {
    g_main_loop_quit(loop);
    g_main_loop_unref(loop);
  }
  return continue_to_watch;
}

static void sample_loop(int fd, GIOCondition cond, GIOFunc callback) {
  GMainLoop *loop = g_main_loop_new(NULL, FALSE);
  GIOChannel *io = g_io_channel_unix_new(fd);
  guint tag = g_io_add_watch(io, cond, callback, g_main_loop_ref(loop));
  g_io_channel_set_flags(io, G_IO_FLAG_NONBLOCK, NULL);
  g_io_channel_set_close_on_unref(io, TRUE);
  g_io_channel_set_encoding(io, NULL, NULL);
  g_main_loop_run(loop);
  g_io_channel_unref(io);
  g_main_loop_unref(loop);
}

int main(int argc, char *argv[]) {
  sample_loop(0, G_IO_IN, read_callback);
  return 0;
}
