export const useShare = (id: Numberish, path: string, title: ComputedRef) => {
  onShareAppMessage(() => {
    return {
      path: `${path}?id=${id}`,
      title: title.value
    };
  });

  onShareTimeline(() => {
    return {
      title: title.value,
      query: `id=${id}`
    };
  });
};
