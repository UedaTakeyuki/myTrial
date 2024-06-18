#include <iostream>
#include <ctime>
#include <chrono>

namespace chrono = std::chrono;

int main()
{
  // UTCベースの現在時間を取得する
  std::timespec ts;
  if (std::timespec_get(&ts, TIME_UTC) == 0) {
    std::cerr << "現在時間の取得に失敗した" << std::endl;
    return 1;
  }

  std::cout << "tv_sec:" << ts.tv_sec
            << " tv_nsec:" << ts.tv_nsec
            << std::endl;

  // 秒未満の値をミリ秒で取得
  auto ms = chrono::duration_cast<chrono::milliseconds>(chrono::nanoseconds{ts.tv_nsec});
  std::cout << "ms:" << ms.count() << std::endl;

  // 秒以上の値だけを日時フォーマットで出力
  std::cout << std::ctime(&ts.tv_sec) << std::endl;
}
