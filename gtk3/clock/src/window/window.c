#include "../screensize/screensize.h" // RPi screen size
#include "window.h"
#include <glib.h>
#include "../experimentals/ssize.h"
#include "widgets/label.h"

extern GtkWidget *infolabel;
extern GtkWidget *clocklabel;
struct width_height *wh;

static guint timer_id;

GtkWidget *createWindow(){

    GtkWidget *window; // *label;
    wh = getScreenSize();

    // Creates a new GtkWindow
    window = gtk_window_new(GTK_WINDOW_TOPLEVEL);

    // Initialize GtkWindow */
    gtk_window_set_title(GTK_WINDOW(window), "infoboard");  //  title
    gint window_height = wh->height/10;
    gint window_width = (wh->width * 5)/6;
    gint window_x_position = 0;
    gint window_y_potision = wh->height - window_height;
    gtk_widget_set_size_request(window, window_width, window_height);      //  window size
    gtk_window_move(GTK_WINDOW(window), window_x_position, window_y_potision);

    GtkCssProvider *provider = gtk_css_provider_new();
    GdkDisplay *display = gdk_display_get_default();
    GdkScreen *screen = gdk_display_get_default_screen (display);
    gtk_style_context_add_provider_for_screen (screen, GTK_STYLE_PROVIDER(provider), GTK_STYLE_PROVIDER_PRIORITY_USER);
    gtk_css_provider_load_from_path(GTK_CSS_PROVIDER(provider),"styles.css",NULL);

    // call experimentals
    showScreenSize();

    // Creates a new label.
    infolabel = createLabel();
    clocklabel = createLabel();
    gtk_label_set_text(GTK_LABEL(infolabel), "aho");
    gtk_label_set_text(GTK_LABEL(clocklabel), "boke");

    GtkWidget *hbox = gtk_box_new (GTK_ORIENTATION_HORIZONTAL, 0);
    gtk_box_pack_end (GTK_BOX(hbox),clocklabel,FALSE,TRUE,0);
    gtk_box_pack_start (GTK_BOX(hbox),infolabel,FALSE,TRUE,0);

    timer_id = g_timeout_add(100, (GSourceFunc) showTime , clocklabel);

    // add box to windwo
    gtk_container_add(GTK_CONTAINER(window), hbox);

    /* set window decolated (with title bar, resize controls, etc) off*/
    gtk_window_set_decorated(GTK_WINDOW(window), FALSE);

    return window;
}