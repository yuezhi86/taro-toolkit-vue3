import Taro from '@tarojs/taro';
import { Ref } from 'vue';
import { useUserStore } from '@/stores';
import { navigateToLoginPage } from '@/helper';
import { errorModal } from '@/utils/errorModal';
import { getRequestHeaders } from '@/utils/request';

export interface UploadOptions {
  uploadRef?: Ref;
  catchRes?: boolean; // 拦截返回结果，对retCode统一处理
  catchFail?: boolean; // 拦截失败retCode请求
  catchExpire?: boolean; // 拦截登录状态过期
  catchError?: boolean; // 拦截错误请求
  customDomain?: boolean; // 使用自定义域名，设为true则不再自动拼接域名
  [p: string]: any;
}

const loginErrorCode = [1401, 1402, 20110001];

export const upload = (
  url: string,
  filePath: string,
  options?: UploadOptions
) => {
  options ??= {};

  return new Promise<any>((resolve, reject) => {
    const userStore = useUserStore();
    // 拦截返回结果，对retCode统一处理
    const catchRes = options.catchRes === undefined ? true : options.catchRes;

    // 拦截失败retCode请求
    const catchFail =
      options.catchFail === undefined ? true : options.catchFail;

    // 拦截错误请求
    const catchError =
      options.catchError === undefined ? true : options.catchError;

    options.url = options.customDomain ? url : `${requestDomain}${url}`;

    options.url = `${requestDomain}${url}`;
    options.name = options.name ?? 'file';
    options.filePath = filePath;
    options.header = getRequestHeaders(
      userStore.state.token,
      userStore.state.merchantId
    );
    options.success = (response: any) => {
      if (response.statusCode === 200) {
        let res = response.data;
        try {
          res = JSON.parse(res);
        } catch (e) {
          res = {};
        }

        let { code, data, message } = res;

        // 拦截返回结果，对retCode统一处理
        if (catchRes) {
          if (code === 1) {
            resolve(data);
          } else if (loginErrorCode.includes(code)) {
            Taro.hideLoading();
            navigateToLoginPage();
            reject({
              message: '登录信息失效',
              code
            });
          } else {
            Taro.hideLoading();

            if (catchFail) {
              const text = message?.length > 50 ? '系统错误' : message;
              errorModal(text ?? '系统错误');
            }

            reject(res);
          }
        } else {
          resolve(res);
        }
      } else {
        Taro.hideLoading();

        if (catchError) {
          const text =
            response.data.error?.length > 50 ? '系统错误' : response.data.error;
          errorModal(text ?? '系统错误');
        }

        reject(response);
      }
    };
    options.fail = (err: any) => {
      Taro.hideLoading();

      if (catchError) {
        const text = err.errMsg?.length > 50 ? '系统错误' : err.errMsg;
        errorModal(text ?? '系统错误');
      }

      reject(err);
    };

    const { uploadRef } = options;
    const ref = Taro.uploadFile(options as any);

    if (uploadRef) {
      uploadRef.value = ref;
    }
  });
};
