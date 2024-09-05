import Taro from '@tarojs/taro';
let errorModalShow = false;
export function errorModal(
  content: string,
  options?: {
    title?: string;
    confirmText?: string;
    showCancel?: boolean;
  }
) {
  if (errorModalShow) return;
  return new Promise<void>((resolve, reject) => {
    options = Object.assign(
      {
        title: '注意',
        confirmText: '确定',
        showCancel: false
      },
      options
    );
    Taro.hideToast();
    Taro.hideLoading();
    if (errorModalShow) return;
    errorModalShow = true;
    Taro.showModal({
      title: `${options.title}`,
      content: `${content}`,
      confirmText: options.confirmText,
      showCancel: options.showCancel,
      success: ({ confirm, cancel }) => {
        if (confirm) {
          resolve();
        } else if (cancel) {
          reject();
        }
        errorModalShow = false;
      },
      fail: () => {
        errorModalShow = false;
      }
    });
  });
}
