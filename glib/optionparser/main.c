// refer https://qiita.com/zukky619/items/06e288be6e04c3526d6f

#include <glib.h>

#define APP_VERSION "1.0.0"

typedef struct{
    gchar *filepath;
    int int_num;
    double double_value;
    gboolean bool;
}S_COMMAND_ARGS;

int main(int argc, char* argv[])
{
    GOptionContext *context;
    GError *err = NULL;
    int i;

    //コマンドライン引数として読み込む変数群の初期値を定義しておく
    S_COMMAND_ARGS command_args = {
        "./hogehoge",
        127,
        3.141592,
        FALSE
    };

    //{引数のフル名、短縮名、オプション指定フラグ、引数の型、代入先、説明文、ヘルプに記載時の変数名}で列挙
    //最終要素はNULLで終わる必要あり
    GOptionEntry entries[] = 
    {
        { "filepath", 'f', 0, G_OPTION_ARG_FILENAME, &command_args.filepath, "Path of user-specified file", "FILEPATH" },
        { "int_num", 'n', 0, G_OPTION_ARG_INT, &command_args.int_num, "Integer num", "N" },
        { "double_value", 'd', 0, G_OPTION_ARG_DOUBLE, &command_args.double_value, "Double value", "D" },
        { "bool", 'b', 0, G_OPTION_ARG_NONE, &command_args.bool, "bool value", NULL},
        { NULL }
    };

    context = g_option_context_new("test app of command-line arg parser.");
    g_option_context_set_description(context, "Version:\n  "APP_VERSION);
    g_option_context_add_main_entries(context, entries, NULL);

    if (!g_option_context_parse(context, &argc, &argv, &err))
    {
        g_print("option parsing failed: %s\n", err->message);
        g_error_free(err);
    } else {
        g_print("filepath     = %s\n", command_args.filepath);
        g_print("int_num      = %d\n", command_args.int_num);
        g_print("double_value = %f\n", command_args.double_value);
        g_print("bool         = %s\n", command_args.bool ? "true" : "false");

        //g_option_context_parseにてargc, argvが更新されている
        //オプション引数としてパース成功したものは除外されている
        for (i = 1; i < argc; i++) {
            g_print("non-option arg[%d] = %s\n", i, argv[i]);
        }
    }

    //開放処理
    g_option_context_free(context);

    return 0;
}