import Taro from '@tarojs/taro';
import { Ref } from 'vue';
import { errorModal } from './errorModal';
import { CreateRequestOptions } from './request';

export interface UploadOptions {
  uploadRef?: Ref;
  catchRes?: boolean; // 拦截返回结果，对retCode统一处理
  catchFail?: boolean; // 拦截失败retCode请求
  catchExpire?: boolean; // 拦截登录状态过期
  catchError?: boolean; // 拦截错误请求
  customDomain?: boolean; // 使用自定义域名，设为true则不再自动拼接域名
  [p: string]: any;
}

export const createUpload = (options: CreateRequestOptions) => {
  const {
    requestDomain,
    responseFields,
    successCode,
    loginErrorCode,
    maxMessageLength = 50,
    customErrorMessage = '系统错误',
    getRequestHeaders,
    navigateToLoginPage
  } = options;

  return (url: string, filePath: string, options: UploadOptions = {}) => {
    return new Promise<any>(async (resolve, reject) => {
      // 拦截返回结果，对retCode统一处理
      const catchRes = options.catchRes === undefined ? true : options.catchRes;

      // 拦截失败retCode请求
      const catchFail =
        options.catchFail === undefined ? true : options.catchFail;

      // 拦截错误请求
      const catchError =
        options.catchError === undefined ? true : options.catchError;

      options.url = options.customDomain ? url : `${requestDomain}${url}`;
      options.name = options.name ?? 'file';
      options.filePath = filePath;
      options.header = (await getRequestHeaders?.()) ?? {};
      options.success = (response: any) => {
        if (response.statusCode === 200) {
          let res = response.data;

          try {
            res = JSON.parse(res);
          } catch (e) {
            res = {};
          }

          const code = res[responseFields?.code ?? 'code'];
          const data = res[responseFields?.data ?? 'data'];
          const message = res[responseFields?.message ?? 'message'];

          // 拦截返回结果，对retCode统一处理
          if (catchRes) {
            if (code === successCode) {
              resolve(data);
            } else if (loginErrorCode.includes(code)) {
              Taro.hideLoading();
              navigateToLoginPage?.();
              reject({
                message: '登录信息失效',
                code
              });
            } else {
              Taro.hideLoading();

              if (catchFail) {
                const text =
                  message?.length > maxMessageLength
                    ? customErrorMessage
                    : message;
                errorModal(text ?? customErrorMessage);
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
              response.data.error?.length > maxMessageLength
                ? customErrorMessage
                : response.data.error;
            errorModal(text ?? customErrorMessage);
          }

          reject(response);
        }
      };
      options.fail = (err: any) => {
        Taro.hideLoading();

        if (catchError) {
          const text =
            err.errMsg?.length > maxMessageLength
              ? customErrorMessage
              : err.errMsg;
          errorModal(text ?? customErrorMessage);
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
};
