#include <glib.h>
#include <gio/gio.h> // gio channel

#include <sys/socket.h> //socket();
#include <netdb.h> // structure

#include <stdio.h> // printf

void deal(GIOChannel *in, GIOCondition condition, gpointer data)
{
    struct sockaddr_storage income;

    int insock = g_io_channel_unix_get_fd(in);
    socklen_t income_len = sizeof(income);
    int newsock = accept(insock, (struct sockaddr*)&income, &income_len );
    if(newsock == -1)
    {
        printf("failure on newsock\n");
    }

    char buff[128];

    int recv_total = 0;
    int recv_byte = 128;
    int recv_sizing;

    while (recv_total < recv_byte ){

    recv_sizing = recv(newsock,buff + recv_total,recv_byte,0);

    // breaking if recv_sizing = -1 assuming as error, 0 assuming as lost communication from client suddenly
    if(recv_sizing < 0 || recv_sizing == 0)
     {
         printf("connection lost or error while recv(); [ just guess ] number : %d \n",recv_sizing);
         break;
    }

    recv_byte -= recv_sizing;
    recv_total += recv_sizing;


    }


    buff[recv_total] = '\0';
    //recv_sizing = recv(newsock,buff,recv_byte,0);
    printf("data : %s\n",buff);

    close(newsock); // close immediate and look for another some1 new


}

int main()
{
    GIOChannel *in;


    struct sockaddr_in my;
    my.sin_addr.s_addr = INADDR_ANY;
    my.sin_family      = AF_INET;
    my.sin_port        = htons(3000);

    //socket initiate root socket
    int rsock = socket(AF_INET,SOCK_STREAM,IPPROTO_TCP);

    //allow re-use address
    setsockopt(rsock,SOL_SOCKET,SO_REUSEADDR,(int*)1,sizeof(int));

    //binding
    bind(rsock,(struct sockaddr*)&my,sizeof(my));

    //listen
    listen(rsock,10);


    in = g_io_channel_unix_new(rsock);

    g_io_add_watch(in, G_IO_IN /* | G_IO_OUT | G_IO_HUP*/ , (GIOFunc) deal, NULL);


    GMainLoop *loop = g_main_loop_new(NULL,FALSE); // pengganti while(1) ato gtk_main_loop
    g_main_loop_run(loop);
    return 0;
}
