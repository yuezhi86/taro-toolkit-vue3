import Taro from '@tarojs/taro';

export const useImagePreview = () => {
  const handleImageTap = (urls?: string | string[], current?: string) => {
    if (!urls) return;
    Taro.previewImage({
      urls: typeof urls === 'string' ? [urls] : urls,
      current
    });
  };

  return {
    handleImageTap
  };
};
