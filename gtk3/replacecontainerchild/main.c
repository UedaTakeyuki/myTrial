#include <gtk/gtk.h>
#include <glib.h>

#include <stdio.h> // printf

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
    window = gtk_window_new(GTK_WINDOW_TOPLEVEL);

    // Set a call back function which is called when the GtkWindow is destroied.
    g_signal_connect(G_OBJECT(window), "destroy",
                     G_CALLBACK(destroy), NULL);

    // Create label-1
    GtkWidget *label1 = gtk_label_new("label 1");

    // add label-1 to the window
    gtk_container_add(GTK_CONTAINER(window), label1);

    // Show window
    gtk_widget_show_all(window);
//    gtk_widget_hide(window);

    // remove label-1
    gtk_container_remove(GTK_CONTAINER(window), label1);

    // Create label-2
    GtkWidget *label2 = gtk_label_new("label 2");

    // add label-1 to the window
    gtk_container_add(GTK_CONTAINER(window), label2);

    gtk_widget_show_all(window);

    //  main event loop
    gtk_main();

    return 0;
}
