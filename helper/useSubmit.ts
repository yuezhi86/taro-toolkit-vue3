import { createLock, hideLoading, showLoading } from '@/utils';

export type submitOptions = {
  beforeSend?: (() => boolean) | (() => Promise<boolean>);
  send: (() => void) | (() => Promise<void>);
  unlockTime?: number;
};
export const useSubmit = () => {
  const btnLoading = ref(false);
  const submitLock = createLock();
  const submitHandler = (options: submitOptions) => {
    return new Promise<void>((resolve, reject) => {
      submitLock(async (lock, unlock) => {
        if (options.beforeSend && (await options.beforeSend()) === false) {
          return;
        }

        try {
          btnLoading.value = true;
          showLoading();
          lock();
          await options.send();
          hideLoading();
          await unlock(options.unlockTime ?? 200);
          resolve();
        } catch (e) {
          hideLoading();
          await unlock();
          reject(e);
        } finally {
          btnLoading.value = false;
        }
      });
    });
  };

  return {
    btnLoading,
    submitHandler
  };
};
