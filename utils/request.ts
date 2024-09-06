import Taro from '@tarojs/taro';
import { errorModal } from './errorModal';

export interface RequestOptions {
  contentType?: string;
  catchRes?: boolean; // 拦截返回结果，对retCode统一处理
  catchFail?: boolean; // 拦截失败retCode请求
  catchExpire?: boolean; // 拦截登录状态过期
  catchError?: boolean; // 拦截错误请求
  customDomain?: boolean; // 使用自定义域名，设为true则不再自动拼接域名
  type?: 'get' | 'post';
  [p: string]: any;
}

export interface CreateRequestOptions {
  requestDomain: string;
  loginErrorCode: Numberish[];
  getRequestHeaders?: () => AnyObject;
  navigateToLoginPage?: () => void;
  responseFields?: {
    code: string;
    data: string;
    message: string;
  };
}

export const createRequest = (options: CreateRequestOptions) => {
  const {
    requestDomain,
    responseFields,
    loginErrorCode,
    getRequestHeaders,
    navigateToLoginPage
  } = options;

  return (url: string, options: RequestOptions = {}) => {
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

      const method = options.type || 'GET';
      options.method = method.toUpperCase();

      if (options.method === 'POST') {
        options.data = JSON.stringify(options.data);
      }

      options.success = (response: any) => {
        if (response.statusCode === 200) {
          const res = response.data;
          const code = res[responseFields?.code ?? 'code'];
          const data = res[responseFields?.data ?? 'data'];
          const message = res[responseFields?.message ?? 'message'];

          // 拦截返回结果，对retCode统一处理
          if (catchRes) {
            if (code === 1) {
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
              response.data.error?.length > 50
                ? '系统错误'
                : response.data.error;
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

      options.header = await getRequestHeaders?.() ?? {};

      options.contentType = options.contentType || 'json';

      const contentType = options.contentType.toLowerCase();

      if (contentType) {
        if (contentType === 'json') {
          options.header['content-type'] = 'application/json';
        } else {
          options.header['content-type'] = options.contentType;
        }
      }

      return Taro.request(options as any);
    });
  };
};
