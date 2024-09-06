import Taro from '@tarojs/taro';
import { errorModal } from '../utils';

export const wxPay = async (
  orderId: Numberish,
  apiPay: (orderId: Numberish) => Promise<AnyObject>
) => {
  return new Promise<Numberish>(async (resolve, reject) => {
    try {
      const res = await apiPay(orderId);
      const {
        timeStamp,
        nonceStr,
        package: packageValue,
        paySign,
        signType
      } = res;
      await Taro.requestPayment({
        timeStamp,
        nonceStr,
        package: packageValue,
        paySign,
        signType
      });
      resolve(orderId);
    } catch (err) {
      await errorModal(err.message ?? '支付失败');
      reject(err);
    }
  });
};
