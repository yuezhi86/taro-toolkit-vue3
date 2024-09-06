import { ref } from 'vue';

export const useList = () => {
  const listRef: any = ref(null);
  return {
    listRef,
    refresh: () => listRef.value?.refresh(),
    nextPage: () => listRef.value?.nextPage()
  };
};
