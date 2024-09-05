const sleepTimeout = new Map();

export const sleep = (ms = 1000) => {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      resolve();
      sleepTimeout.delete(timer);
    }, ms);
    sleepTimeout.set(timer, timer);
  });
};

export const clearSleep = () => {
  sleepTimeout.forEach((item) => {
    clearTimeout(item);
  });
  sleepTimeout.clear();
};
