declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

// @ts-ignore
declare const process: {
  env: {
    TARO_ENV:
      | 'weapp'
      | 'swan'
      | 'alipay'
      | 'h5'
      | 'rn'
      | 'tt'
      | 'quickapp'
      | 'qq';
    [key: string]: any;
  };
};

declare module '@tarojs/components' {
  export * from '@tarojs/components/types/index.vue3';
}

declare module '@nutui/touch-emulator' {}

declare type Numberish = string | number;
declare type AnyObject = Record<string, any>;

declare const requestDomain: string;
declare const projectName: string;
declare const primaryColor: string;
declare const clientKey: string;
declare const sourceKey: string;
declare const source: string;
declare const appId: string;
declare const localStorageKey: string;
declare const wx: Record<string, any>;
