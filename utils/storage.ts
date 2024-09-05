import Storage from './dataStorage';

export type StorageInst = {
  getStorageKeys: () => Promise<string[]>;
  getStorageByName: (key: string) => Promise<any>;
  hasStorageByName: (key: string) => Promise<boolean>;
  removeStorageByName: (key: string) => Promise<boolean>;
  clearStorage: () => Promise<void>;
  setStorage: (options: any) => Promise<any>;
};

let inst: StorageInst;

const getInst = () => {
  if (inst) {
    return inst;
  } else {
    inst = new Storage(localStorageKey) as any;

    return inst;
  }
};

export default getInst();
