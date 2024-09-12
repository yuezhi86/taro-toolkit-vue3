import Taro from '@tarojs/taro';

export const checkSetting = async (scopes: string[], showSetting?: boolean) => {
  const { authSetting, subscriptionsSetting } = await getSetting();
  const settings = { ...authSetting, ...subscriptionsSetting };
  for (let scope of scopes) {
    if (settings[scope] === false) {
      if (showSetting) {
        await openSetting();
      }
      return false;
    }
  }

  return true;
};

export const getSetting = () => {
  return Taro.getSetting({ withSubscriptions: true });
};

export const openSetting = async () => {
  await Taro.openSetting({ withSubscriptions: true });
};
