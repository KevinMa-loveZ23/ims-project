export { setExpirableLocalStorage, getExpirableLocalStorage };

import { LocalStorage } from 'quasar'
class ExpirableStore {
  /**
   *
   * @param {*} value - Value
   * @param {number} expireTimeInMsec - Expire Timestamp in Msec
   */
  constructor(value, expireTimeInMsec) {
    this.value = value;
    this.expireTime = expireTimeInMsec;
  }
}

/**
 *
 * @param {string} key - Key
 * @param {*} value - Value
 * @param {number} expireTimeInMsec - Expire Time in Msec
 */
function setExpirableLocalStorage(key, value, expireTimeInMsec) {
  const jsonStr = JSON.stringify(new ExpirableStore(value, expireTimeInMsec));
  localStorage.setItem(key, jsonStr);
  // const expStore = new ExpirableStore(value, expireTimeInMsec)
  // LocalStorage.set(key, expStore)
}

/**
 *
 * @param {string} key - Key
 * @returns {*} - Value or Null
 */
function getExpirableLocalStorage(key) {
  const store = localStorage.getItem(key);
  if (!store) {
    return null;
  } else {
    /**
     * @type {ExpirableStore}
     */
    const valueAndExp = JSON.parse(store);
    // console.log(valueAndExp)
    if (valueAndExp.expireTime <= new Date().getTime()) {
      localStorage.removeItem(key);
      return null;
    } else {
      return valueAndExp.value;
    }
  }
  // /**
  //  * @type {ExpirableStore}
  //  */
  // const expStore = LocalStorage.getItem(key)
  // if (!expStore) {
  //   return null
  // } else {
  //   if (expStore.expireTime <= new Date().getTime()) {
  //     LocalStorage.remove(key)
  //     return null
  //   } else {
  //     return expStore.value
  //   }
  // }
}
