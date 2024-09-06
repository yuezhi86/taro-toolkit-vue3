import Taro from '@tarojs/taro';
import { usePageTools } from '@/helper/usePageTools';

export const loginPagePath = '/pages/auth/index';
export const navigateToLoginPage = () => {
  const router = useRouter();
  if (router.path === loginPagePath) return;
  Taro.navigateTo({
    url: loginPagePath
  });
};

export enum ContentTypeEnum {
  rich = 1,
  link
}
export enum LinkTypeEnum {
  outerWeapp = 1,
  innerLink,
  outerLink
}
export const navigateToActivityDetails = (item: AnyObject, path: string) => {
  const { handleToPage } = usePageTools();

  if (item.contextType === ContentTypeEnum.rich) {
    handleToPage(path);
    return;
  }

  const { linkType, linkValue } = item;

  switch (linkType) {
    case LinkTypeEnum.outerWeapp:
      Taro.navigateToMiniProgram({
        // envVersion: process.env.BUILD_MODE === 'test' ? 'trial' : 'develop',
        shortLink: linkValue
      });
      break;
    case LinkTypeEnum.innerLink:
      handleToPage(linkValue);
      break;
    case LinkTypeEnum.outerLink:
      handleToPage(`/pages/webview/index?url=${linkValue}`);
      break;
  }
};
