import Taro from '@tarojs/taro';
export function showLoading(title = '加载中', mask = true) {
  Taro.showLoading({
    title,
    mask
  });
}

export const hideLoading = Taro.hideLoading;
