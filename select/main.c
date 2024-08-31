#include <stdio.h>
#include <sys/time.h> // struct timeval
#include <unistd.h> // sleep
#include <gtk/gtk.h>
#include <webkit2/webkit2.h>

static gboolean repeat(gpointer user_data){
  printf("repeat.\n");
/*
  for (;;) {
//    delay(300000);
    printf("before sleep.\n");
    sleep(300);
    printf("after sleep.\n");
    {
      // XXX Too bad if you don't have select().
      struct timeval t;
      t.tv_sec = 300;
      t.tv_usec = 0;
      printf("before select.\n");
      select(0, (fd_set *)0, (fd_set *)0, (fd_set *)0, &t);
      printf("after select.\n");
    }
  }
*/
  return TRUE;
}

void main(int argc, char* argv[]){
  // Initialize GTK+
  gtk_init(&argc, &argv);

  // Create an 800x600 window that will contain the browser instance
  GtkWidget *main_window = gtk_window_new(GTK_WINDOW_TOPLEVEL);

  // Create a browser instance
  WebKitWebView *webView = WEBKIT_WEB_VIEW(webkit_web_view_new());

  // Put the browser area into the main window
  gtk_container_add(GTK_CONTAINER(main_window), GTK_WIDGET(webView));
  
  gchar *url = "https://openweathermap.org/city/1852278";
  webkit_web_view_load_uri(webView, url);
//  g_free (url);

  // Make sure that when the browser area becomes visible, it will get mouse
  // and keyboard events
  gtk_widget_grab_focus(GTK_WIDGET(webView));

  // Make sure the main window and all its contents are visible
  gtk_widget_show_all(main_window);

  g_timeout_add_seconds (300, repeat, NULL);

  gtk_main();
}