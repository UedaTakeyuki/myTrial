#include <gtk/gtk.h>
void showScreenSize(){

    GdkDisplay *display = gdk_display_get_default();

  // https://www.chihayafuru.jp/tech/index.php/archives/2412
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"
    printf("screen higth: %d\n", gdk_screen_height());
    printf("screen width: %d\n", gdk_screen_width());
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"
    GdkWindow* gdkwindow = gdk_get_default_root_window ();
    GdkMonitor* monitor = gdk_display_get_monitor_at_window (display, gdkwindow);
    printf("monitor higth mm: %d\n", gdk_monitor_get_height_mm (monitor));
    printf("monitor width mm: %d\n", gdk_monitor_get_width_mm(monitor));
    printf("monitor scall factor: %d\n", gdk_monitor_get_scale_factor(monitor));
    GdkMonitor* primonitor = gdk_display_get_primary_monitor (display);
    printf("primary monitor higth mm: %d\n", gdk_monitor_get_height_mm (primonitor));
    printf("primary monitor width mm: %d\n", gdk_monitor_get_width_mm(primonitor));
    printf("primary monitor scall factor: %d\n", gdk_monitor_get_scale_factor(primonitor));
    GdkRectangle workarea = {0};
    gdk_monitor_get_workarea(
        gdk_display_get_primary_monitor(gdk_display_get_default()),
        &workarea);
    printf ("W: %u x H:%u\n", workarea.width, workarea.height);
}