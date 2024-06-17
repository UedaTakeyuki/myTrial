#include <gtk/gtk.h>
#include "../../screensize/screensize.h"

extern struct width_height *wh;
GtkWidget *createLabel(){
    GtkWidget *label;

    label = gtk_label_new("");
    gtk_widget_set_halign(label, GTK_ALIGN_FILL);
    gtk_widget_set_valign(label, GTK_ALIGN_FILL);
    gtk_label_set_xalign (GTK_LABEL(label), 0.01);

    // adapt style sheet
    GtkStyleContext *contextstyle;
    contextstyle = gtk_widget_get_style_context(label);
    gtk_style_context_add_class(contextstyle,"kerokero_label");

    /*  change font size of this Label */
    PangoContext* context = gtk_widget_get_pango_context (label);
    PangoFontDescription* fdesc = pango_context_get_font_description (context);
    pango_font_description_set_size(fdesc, wh->height / 18 * PANGO_SCALE);
    pango_font_description_set_weight (fdesc, PANGO_WEIGHT_BOLD);
    pango_context_set_font_description (context, fdesc);

    return label;
}

gboolean showTime(gpointer user_data){
    GtkLabel *label=GTK_LABEL(user_data);

    GDateTime* now=g_date_time_new_now_local();
    gint hour=g_date_time_get_hour (now);
    gint minute=g_date_time_get_minute (now);
    gint seconds=g_date_time_get_seconds (now);
    gchar hms[10]; // hour:min:sec string
    g_snprintf(hms, 9, "%02d:%02d:%02d", hour, minute, seconds);
    gtk_label_set_text(label, hms);
}