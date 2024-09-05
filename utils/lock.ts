type Callback = () => void;
type Lock = Callback;
type Unlock = (delay?: number, cb?: Callback) => Promise<void>;
type Fn = (lock: Lock, unlock: Unlock) => void;

export function createLock() {
  let status = false;
  let timer: any;
  const lock: Lock = () => {
    clearTimeout(timer);
    status = true;
  };
  const unlock: Unlock = (delay = 0, cb?) => {
    return new Promise<void>((resolve) => {
      if (delay > 0) {
        timer = setTimeout(() => {
          status = false;
          cb && cb();
          resolve();
        }, delay);
      } else {
        status = false;
        cb && cb();
        resolve();
      }
    });
  };

  return function (fn: Fn) {
    if (status) return;
    fn(lock, unlock);
  };
}
