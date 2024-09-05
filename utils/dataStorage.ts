import Taro from '@tarojs/taro';

/**
 * 定制化的 wxStorage
 */
export default class Storage {
  keyName: string;

  constructor(keyName) {
    this.keyName = keyName;
  }

  getStorageKeys = () => {
    return new Promise<string[]>((resolve) => {
      Taro.getStorageInfo({
        success: ({ keys = [] }) => {
          resolve(keys.filter((key) => key.indexOf(this.keyName) === 0));
        },
        fail: () => {
          resolve([]);
        }
      });
    });
  };

  getKeyName = (key) => `${this.keyName}.${key}`;

  /**
   * 获取指定key的数据
   *
   * @param key
   */
  getStorageByName = (key) => {
    return new Promise((resolve) => {
      Taro.getStorage({
        key: this.getKeyName(key),
        success: ({ data }) => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(undefined);
          }
        },
        fail: () => {
          resolve(undefined);
        }
      });
    });
  };

  /**
   * 查询storage中是否存在指定key的数据
   *
   * @param key
   */
  hasStorageByName = async (key) => {
    const keys = await this.getStorageKeys();

    return Promise.resolve(keys.includes(this.getKeyName(key)));
  };

  /**
   * 从storage中删除指定的数据
   *
   * @param key
   */
  removeStorageByName = (key) => {
    return new Promise((resolve, reject) => {
      Taro.removeStorage({
        key: this.getKeyName(key),
        success: () => {
          resolve(true);
        },
        fail: () => {
          reject(false);
        }
      });
    });
  };

  /**
   * 清空storage(只会删除定制化的storage数据)
   *
   * @return {*}
   */
  clearStorage = async () => {
    const keys = await this.getStorageKeys();
    const asyncList = keys.map((key) => {
      return new Promise<void>((resolve, reject) => {
        Taro.removeStorage({
          key,
          success: () => {
            resolve();
          },
          fail: () => {
            reject();
          }
        });
      });
    });

    return new Promise((resolve, reject) => {
      Promise.all(asyncList)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          reject(false);
        });
    });
  };

  /**
   * 向storage写入指定数据
   *
   * @param {array | object} options
   */
  setStorage = (options) => {
    let data = options;

    if (!Array.isArray(options)) {
      data = [options];
    }

    const asyncList = data.map((item) => {
      return new Promise<void>((resolve, reject) => {
        Taro.setStorage({
          key: this.getKeyName(item.key),
          data: JSON.stringify(item.value),
          success: () => {
            resolve();
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    });

    return new Promise((resolve, reject) => {
      Promise.all(asyncList)
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
}
