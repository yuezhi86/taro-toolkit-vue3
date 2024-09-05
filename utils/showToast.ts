import Taro from '@tarojs/taro';

type Options = {
  success?: Function;
  immediate?: boolean;
  [propName: string]: any;
};

export const showToast = (title: string, options: Options = {}) => {
  const app = Taro.getApp();

  app.toastTimer = app.toastTimer || [];

  const success =
    typeof options.success === 'function' ? options.success : () => {};
  const immediate = options.immediate === undefined ? true : options.immediate;

  let toastOptions = Object.assign(
    {
      title,
      icon: 'none',
      duration: 2000,
      mask: options.mask ?? true
    },
    options
  );

  toastOptions.success = () => {
    if (immediate) {
      success();
    } else {
      app.toastTimer.forEach((item: any) => {
        clearTimeout(item);
      });

      app.toastTimer = [];

      const timer = setTimeout(() => {
        success();
      }, toastOptions.duration);

      app.toastTimer.push(timer);
    }
  };

  return Taro.showToast(toastOptions as any);
};
