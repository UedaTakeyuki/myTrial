#ifndef SCREENSIZE_H
#define SCREENSIZE_H

#include <glib.h>

// Width & Height struct
struct width_height {
    gint width;
    gint height;
};

// Get RPi Screen (FB) size 
struct width_height *getScreenSize();

#endif /* SCREENSIZE_H */