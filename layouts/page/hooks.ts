import { showToast as Toast } from '@/utils';

export const usePage = () => {
  const pageRef: any = ref(null);

  return {
    pageRef,
    showToast: (message: string, options?: AnyObject) => {
      if (pageRef.value) {
        pageRef.value.showToast(message, options);
      } else {
        Toast(message, options);
      }
    },
    showDialog: (content: string, options?: AnyObject) => {
      return new Promise<void>((resolve, reject) => {
        const onConfirm = () => {
          resolve();
        };
        const onCancel = () => {
          reject();
        };
        pageRef.value?.showDialog?.(content, {
          onConfirm,
          onCancel,
          ...(options ?? {})
        });
      });
    }
  };
};

export const usePageInject = () => {
  const showToast =
    inject<(message: string, options?: AnyObject) => void>('showToast');
  const showDialog =
    inject<(content: string, options?: AnyObject) => Promise<void>>(
      'showDialog'
    );

  return {
    showToast: showToast ?? Toast,
    showDialog
  };
};
