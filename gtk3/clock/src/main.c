// https://qiita.com/code2545Light/items/cda2e787ef6297022112
#include <gtk/gtk.h>
#include <glib.h>

#include <netdb.h> // structure

#include <stdio.h> // printf

#include "window/window.h"

GtkWidget *infolabel; // for showing infomation
GtkWidget *clocklabel; // for clock

static void destroy(GtkWidget *window, gpointer data)
{
    // Quit main loop
    gtk_main_quit();
}

int main(int argc, char *argv[])
{
    GtkWidget *window;

    // * Initialize GTK+
    gtk_init(&argc, &argv);

    // Creates a new GtkWindow
    window = createWindow ();

    // Set a call back function which is called when the GtkWindow is destroied.
    g_signal_connect(G_OBJECT(window), "destroy",
                     G_CALLBACK(destroy), NULL);

    // Show window
    gtk_widget_show_all(window);

    //  main event loop
    gtk_main();

    return 0;
}