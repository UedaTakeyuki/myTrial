#include <stdio.h>
#include <sys/time.h> // struct timeval
#include <unistd.h> // sleep
#include <gtk/gtk.h>
#include <webkit2/webkit2.h>
#include <sys/types.h>
#include <unistd.h>

static int repeat_count = 0;
gchar *reloaDScript;

typedef	struct {
	WebKitWebView *webView;
  gchar *script;
} OnceCbParamType;

static gboolean repeat(gpointer user_data){
  OnceCbParamType *param = user_data;
  printf("repeat. repeat_count: %d\n",repeat_count);
  if (repeat_count == 20){
    repeat_count = 0;
    printf("reload! \n");
    webkit_web_view_run_javascript(param->webView,
                                   param->script,
                                   NULL,
                                   NULL, //web_view_javascript_finished,
                                   NULL);
  }
  repeat_count++;
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

  // read script
  gsize length;
  GError *error;
  gchar *reloadScript;
  if (g_file_get_contents ("reload.js",
                     &reloadScript,
                     &length,
                     &error)){
//    g_warning("script: %s", relodeScript);
  } else {
    g_warning ("Error running javascript: %s", error->message);
    g_error_free (error);
  }

  // make reloadParam
  reloadScript = g_strconcat("const myOpenWeatherURL = '", url, "'\n", reloadScript, NULL);
  OnceCbParamType reloadParam;
  reloadParam.webView = webView;
  reloadParam.script = reloadScript;
  printf("reloadScript:\n%s\n",reloadParam.script);

  g_timeout_add_seconds (30, repeat, &reloadParam);

  pid_t mypid = getpid();
  printf("pid: %d\n",mypid);

  {
    GString *command_line = g_string_new ("");
    g_string_printf (command_line, "pgrep -lP %d", mypid);
    gchar *standard_output = NULL;
    gboolean result;
    GError *error = NULL;
    gint status;

    result = g_spawn_command_line_sync (
      command_line->str, // const gchar* command_line,
      &standard_output, // gchar** standard_output,
      NULL, // gchar** standard_error,
      &status, // gint* wait_status,
      &error// GError** error
    );
    if (!result){ // error handling
      g_print("err: %s\n", error->message);
      g_print("err: %d\n", error->code);
      g_print("status: %d\n", status);
      g_error_free (error);
    } else {
      printf("standard_output: %s",standard_output);
      gchar **lines = g_strsplit(standard_output, "\n", 0);
      for (int i =0; i < sizeof(lines) / sizeof(gchar *); i++){
        gchar **line = g_strsplit(lines[i], " ", 0);
        if (g_strcmp0(g_strstrip(line[1]), "WebKitWebProces")){
          printf("match\n");
        } else {
          printf("line[1]: %s", g_strstrip(line[1]));
        }
      }
      printf("first %s\n", lines[0]);
    }
  }
  gtk_main();
}