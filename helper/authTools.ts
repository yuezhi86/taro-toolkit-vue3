import { hideLoading, showLoading, storage } from '@/utils';
import { useUserStore } from '@/stores';
import { apiGetUserInfo } from '@/apis/common';
import Taro from '@tarojs/taro';
import { apiAuthLogin, apiGetOpenId } from '@/pages/auth/apis';

const TOKEN = 'token';
const MERCHANT_ID = 'merchantId';

export const loginHandler = async (data: AnyObject) => {
  const userStore = useUserStore();
  let { dt: token, dm: merchantId, ...userInfo } = data;
  userStore.setUserInfo(userInfo);

  const hasToken = await storage.hasStorageByName(TOKEN);
  const hasMerchantId = await storage.hasStorageByName(MERCHANT_ID);
  token = token ?? (hasToken ? await storage.getStorageByName(TOKEN) : '');
  merchantId =
    merchantId ??
    (hasMerchantId ? await storage.getStorageByName(MERCHANT_ID) : '');

  if (process.env.NODE_ENV !== 'production') {
    console.log('dt:', token);
    console.log('dm:', merchantId);
  }

  userStore.setState({
    token,
    merchantId,
    isLogin: true
  });
  await storage.setStorage([
    {
      key: TOKEN,
      value: token
    },
    {
      key: MERCHANT_ID,
      value: merchantId
    }
  ]);
};

export const logoutHandler = async () => {
  const userStore = useUserStore();
  userStore.setState({
    token: '',
    merchantId: '',
    isLogin: false,
    userInfo: {}
  });
  await storage.removeStorageByName(TOKEN);
  await storage.removeStorageByName(MERCHANT_ID);
};

export const checkToken = async () => {
  const hasToken = await storage.hasStorageByName(TOKEN);
  if (!hasToken) return;

  try {
    const data = await apiGetUserInfo();
    await loginHandler(data);
  } catch (e) {
    await logoutHandler();
  }
};

export const authLogin = async () => {
  try {
    const { code } = await Taro.login();
    showLoading();
    const { wechatSessionKey } = await apiGetOpenId(code);
    const data = await apiAuthLogin({ wechatSessionKey });
    await loginHandler(data);
    hideLoading();
    return true;
  } catch (e) {
    hideLoading();
    await logoutHandler();
    return false;
  }
};
