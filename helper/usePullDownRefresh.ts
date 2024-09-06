import Taro, { usePullDownRefresh as onPullDownRefresh } from '@tarojs/taro';

export const usePullDownRefresh = (fetchData: () => any) => {
  onPullDownRefresh(async () => {
    try {
      await fetchData();
    } finally {
      Taro.stopPullDownRefresh();
    }
  });
};
