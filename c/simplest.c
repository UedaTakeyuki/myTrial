#include <curl/curl.h>

int main(int argc, char *argv[]) {
    CURL *curl = curl_easy_init();
    curl_easy_setopt(curl, CURLOPT_URL, "https://uedasoft.com");
    CURLcode res = curl_easy_perform(curl);
    res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);
}
