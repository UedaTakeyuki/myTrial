#include <glib.h>
#include <gio/gio.h> // gio channel

//#include <sys/socket.h> //socket();
#include <netdb.h> // structure

#include <stdio.h> // printf
#include "ud_ucase.h" // unixdomain socket

void deal(GIOChannel *in, GIOCondition condition, gpointer data)
{
    ssize_t numBytes;
    int j;
    int sfd = g_io_channel_unix_get_fd(in);
    socklen_t len= sizeof(struct sockaddr_un);
    char buf[BUF_SIZE];
    struct sockaddr_un svaddr, claddr;
    numBytes = recvfrom(sfd, buf, BUF_SIZE, 0,
                        (struct sockaddr *) &claddr, &len);
    if (numBytes == -1)
            printf("recvfrom");

    printf("Server received %ld bytes from %s\n", (long) numBytes,
            claddr.sun_path);
    
    buf[numBytes] = 0;
    printf("Received message %s\n", buf);

    for (j = 0; j < numBytes; j++)
        buf[j] = toupper((unsigned char) buf[j]);

    if (sendto(sfd, buf, numBytes, 0, (struct sockaddr *) &claddr, len) != numBytes)
        printf("sendto");
}

int main()
{
    GIOChannel *in;


    struct sockaddr_un svaddr, claddr;
    int sfd, j;
    ssize_t numBytes;
    socklen_t len;
    char buf[BUF_SIZE];

    sfd = socket(AF_UNIX, SOCK_DGRAM, 0);       /* Create server socket */
    if (sfd == -1)
         printf("socket");

    /* Construct well-known address and bind server socket to it */

    if (strlen(SV_SOCK_PATH) > sizeof(svaddr.sun_path) - 1)
         printf("Server socket path too long: %s", SV_SOCK_PATH);

    if (remove(SV_SOCK_PATH) == -1 && errno != ENOENT)
         printf("remove-%s", SV_SOCK_PATH);

    memset(&svaddr, 0, sizeof(struct sockaddr_un));
    svaddr.sun_family = AF_UNIX;
    strncpy(svaddr.sun_path, SV_SOCK_PATH, sizeof(svaddr.sun_path) - 1);

    if (bind(sfd, (struct sockaddr *) &svaddr, sizeof(struct sockaddr_un)) == -1)
         printf("bind");

    in = g_io_channel_unix_new(sfd);

    g_io_add_watch(in, G_IO_IN /* | G_IO_OUT | G_IO_HUP*/ , (GIOFunc) deal, NULL);


    GMainLoop *loop = g_main_loop_new(NULL,FALSE); // pengganti while(1) ato gtk_main_loop
    g_main_loop_run(loop);
    return 0;
}
