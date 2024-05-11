import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";
import { getExpirableLocalStorage, setExpirableLocalStorage } from "./expirable-local-storage";
// import { LocalStorage } from 'quasar'
import { computed, ref } from "vue";

class UserInfo{
  /**
   *
   * @param {bigInt} id - Account ID
   * @param {string} token - Token
   */
  constructor(id, token) {
    this.id = id;
    this.token = token;
  }
  /**
   *
   * @param {SerializableUserInfo} sObj - serializable User Info
   * @returns {UserInfo}
   */
  static fromSerializable(sObj) {
    return new UserInfo(BigInt(sObj.id), sObj.token)
  }
  /**
   *
   * @returns {SerializableUserInfo}
   */
  toSerializable() {
    const idStr = this.id === null ? null : this.id.toString()
    return new SerializableUserInfo(idStr, this.token)
  }
}

class SerializableUserInfo{
  /**
   *
   * @param {string} id - Account ID in String
   * @param {string} token - Token
   */
  constructor(id, token) {
    this.id = id
    this.token = token
  }
}

const userInfoKey = "USER_INFO_KEY"

/**
 * @type {SerializableUserInfo}
 */
const initSUserInfo = getExpirableLocalStorage(userInfoKey);

// /**
//  * @type {UserInfo}
//  */
// const initUserInfo = getExpirableLocalStorage(userInfoKey);

/**
 * @type {UserInfo}
 */
const initUserInfo = initSUserInfo === null ? null :  UserInfo.fromSerializable(initSUserInfo);

/**
 * @type {string}
 */
const initToken = initUserInfo === null ? null : initUserInfo.token;
/**
 * @type {bigint}
 */
const initId = initUserInfo === null ? null : initUserInfo.id;
/**
 *
 * @type {number}
 */
const initTokenExpInMsec = initToken === null ? null : jwtDecode(initToken).exp * 1000;

// console.log(initToken)

export const useAuthStore = defineStore("authStore", () => {
  /**
   * @type {import('vue').Ref<string>}
   */
  const token = ref(initToken);
  /**
   * @type {import('vue').Ref<Number>}
   */
  const expireAtInMsec = ref(initTokenExpInMsec);
  /**
   * @type {import("vue").Ref<bigInt>}
   */
  const uid = ref(initId);

  const isTokenEmpty = computed(() => token.value === null);
  const isExpireAtInMsecEmpty = computed(() => expireAtInMsec.value === null);
  const isIdEmpty = computed(() => uid.value === null);

  const bearerToken = computed(() => {
    if (isTokenEmpty.value) {
      return null;
    } else {
      return "Bearer " + token.value;
    }
  });
  const expireTime = computed(() => {
    if (isTokenEmpty.value) {
      return null;
    }
    if (isExpireAtInMsecEmpty.value) {
      expireAtInMsec.value = jwtDecode(token.value).exp;
    }
    return new Date(expireAtInMsec.value);
  });
  const shouldRenewToken = computed(() => {
    if (isExpireAtInMsecEmpty.value) {
      return true;
    }
    return expireAtInMsec.value - new Date().getTime() < 1000 * 60 * 60 * 84; // 3.5 day
  });
  const isTokenExpired = computed(() => {
    if (isExpireAtInMsecEmpty.value) {
      return true;
    }
    return expireAtInMsec.value - new Date().getTime() <= 0;
  });

  /**
   *
   * @param {string} newToken - new token
   */
  function updateToken(newToken) {
    const payload = jwtDecode(newToken);
    token.value = newToken;
    expireAtInMsec.value = payload.exp * 1000;
    uid.value = BigInt(payload.sub);
    // const userInfo = new UserInfo(id.value, token.value).toString();
    // setExpirableLocalStorage(tokenKey, userInfo, expireAt.value * 1000);
    const userInfo = new UserInfo(uid.value, token.value)
    const sUserInfo = userInfo.toSerializable()
    setExpirableLocalStorage(userInfoKey, sUserInfo, expireAtInMsec.value)
  }

  function clearToken() {
    token.value = null
    uid.value = null
    expireAtInMsec.value = null
    const userInfo = new UserInfo(uid.value, token.value)
    const sUserInfo = userInfo.toSerializable()
    setExpirableLocalStorage(userInfoKey, sUserInfo, 0)
  }

  return {
    token,
    expireAtInMsec,
    uid,
    isTokenEmpty,
    isExpireAtInMsecEmpty,
    isIdEmpty,
    bearerToken,
    expireTime,
    shouldRenewToken,
    isTokenExpired,
    updateToken,
    clearToken,
  };
});
