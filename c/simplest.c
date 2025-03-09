#include <curl/curl.h>
#include <glib.h>

size_t write_callback(char *ptr, size_t size, size_t nmemb, void *userdata){
  GString *response_body = (GString *)userdata;
  g_string_insert_len (response_body, -1, ptr, size * nmemb);
  return size * nmemb;
}

int main(int argc, char *argv[]) {
    GString *response_body = g_string_new("");

    CURL *curl = curl_easy_init();
    curl_easy_setopt(curl, CURLOPT_URL, "http://[::]:8080/");
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *)response_body);
    CURLcode res = curl_easy_perform(curl);
    g_print(response_body->str);

    curl_easy_cleanup(curl);
    g_free(response_body);
}
