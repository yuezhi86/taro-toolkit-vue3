import Taro from '@tarojs/taro';

export const usePageTools = () => {
  const handleToPage = (url: string, redirect = false) => {
    if (redirect) {
      Taro.redirectTo({
        url
      });
    } else {
      Taro.navigateTo({
        url
      });
    }
  };

  return {
    handleToPage
  };
};
