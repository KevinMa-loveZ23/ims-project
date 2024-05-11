import axios, { HttpStatusCode } from "axios";
import { baseUrl } from "../base-url";
import { ResponseDataBody, StdResponse } from "../dto/response/response";
import store from "src/stores/index";
import { useAuthStore } from "src/stores/user-id-store";
import { renewRefreshToken } from "./auth";

export {
  axiosInstance, makeUncheckRequest, makeSimpleRequest, makeRequest, makeConfig, makeConfigWithoutAuth, makeFileUploadConfig
}

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 20000
})

/**
 *
 * @param {import("axios").AxiosRequestConfig<any>} config - configuration
 * @param {(response:StdResponse)=>any} thenFn - then function
 * @param {(response:import("axios").AxiosResponse<any, any>, defaultErrorMessage:string)=>any} catchFn - catch function
 * @returns {Promise<any>} - return value
 */
/**
 *
 * @param {import("axios").AxiosRequestConfig<any>} config - configuration
 * @param {(response:import("axios").AxiosResponse<any, any>)=>any} thenFn - then function
 * @param {(response:import("axios").AxiosResponse<any, any>, defaultErrorMessage:string)=>any} catchFn - catch function
 * @returns {Promise<any>} - return value
 */
async function makeUncheckRequest(
  config,
  thenFn = (res) => {return res},
  catchFn = errorDataProcessDefault
) {
  try {
    const response = await axiosInstance(config);
    // console.log(response)
    return thenFn(response);
  } catch (err) {
    /**
     * @type {import("axios").AxiosResponse<any, any> | null}
     */
    const errRes = err.response;
    if (errRes) {
      /**
       * @type {StdResponse}
       */
      const resData = errRes.data;
      console.log(resData);
      catchFn(errRes);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log('Error', err.message);
    }
    throw new Error(err.message)
  }
}

/**
 *
 * @param {import("axios").AxiosRequestConfig<any>} config - configuration
 * @param {(response:import("axios").AxiosResponse<any, any>)=>any} thenFn - then function
 * @param {(response:import("axios").AxiosResponse<any, any>, defaultErrorMessage:string)=>any} catchFn - catch function
 * @returns {Promise<any>} - return value
 */
async function makeSimpleRequest(
  config,
  thenFn = (res) => {return res},
  catchFn = errorDataProcessDefault
) {
  const authStore = useAuthStore()
  // if (authStore.shouldRenewToken) {
  //   const token = authStore.token
  //   const newToken = await renewRefreshToken(token)
  //   authStore.updateToken(newToken)
  //   config.headers.Authorization = authStore.bearerToken
  // }
  return makeUncheckRequest(
    config,
    thenFn,
    catchFn
  )
  // try {
  //   const response = await axiosInstance(config);
  //   // /**
  //   //  * @type {StdResponse}
  //   //  */
  //   // const responseData = response.data;
  //   return thenFn(response);
  // } catch (err) {
  //   /**
  //    * @type {import("axios").AxiosResponse<any, any> | null}
  //    */
  //   const errRes = err.response;
  //   if (errRes) {
  //     /**
  //      * @type {StdResponse}
  //      */
  //     const resData = errRes.data;
  //     console.log(resData);
  //     catchFn(errRes);
  //   } else if (err.request) {
  //     console.log(err.request);
  //   } else {
  //     console.log('Error', err.message);
  //   }
  //   throw new Error(err.message)
  // }
}

/**
 *
 * @param {import("axios").AxiosRequestConfig<any>} config - configuration
 * @param {(response:StdResponse)=>any} thenFn - then function
 * @param {(response:import("axios").AxiosResponse<any, any>, defaultErrorMessage:string)=>any} catchFn - catch function
 * @returns {Promise<any>} - return value
 */
async function makeRequest(
  config,
  thenFn = (res) => {return res.responseBody},
  catchFn = errorDataProcessDefault
) {
  return makeSimpleRequest(config, (response) =>{return thenFn(response.data)}, catchFn)
  // try {
  //   const response = await axiosInstance(config);
  //   /**
  //    * @type {StdResponse}
  //    */
  //   const responseData = response.data;
  //   return thenFn(responseData);
  // } catch (err) {
  //   /**
  //    * @type {import("axios").AxiosResponse<any, any> | null}
  //    */
  //   const errRes = err.response;
  //   if (errRes) {
  //     /**
  //      * @type {StdResponse}
  //      */
  //     const resData = errRes.data;
  //     console.log(resData);
  //     catchFn(errRes);
  //   } else if (err.request) {
  //     console.log(err.request);
  //   } else {
  //     console.log('Error', err.message);
  //   }
  //   throw new Error(err.message)
  // }
}
/**
 *
 * @param {import("axios").AxiosResponse<any, any>} errorResponse - error response
 * @param {string} defaultErrorMessage - default error message
 */
function errorDataProcessDefault(
  errorResponse,
  defaultErrorMessage = "default error message"
) {
  // if (errorResponse.data) {
  //   //
  // }
  switch (errorResponse.status) {
    case HttpStatusCode.Unauthorized:
      const authStore = useAuthStore()
      authStore.clearToken()
      const error401 = new Error("Token invalid or expired")
      console.log(error401)
      location.reload()
      throw error401
    case HttpStatusCode.Forbidden:
      throw new Error("Permission denied")

    default:
      /**
       * @type {StdResponse}
       */
      const errResData = errorResponse.data
      console.log(errResData)
      throw new Error(errResData.info?errResData.info:defaultErrorMessage)
  }
}

/**
 *
 * @param {'get'|'post'|'put'|'delete'} method - http method
 * @param {string} url - url
 * @param {Object | null} data - data
 * @param {Object | null} params - params object
 * @returns {import("axios").AxiosRequestConfig<any>} - request config
 */
function makeConfigWithoutAuth(
  method,
  url,
  data = null,
  params = null
) {
  const config = { url: url, method: method }
  if (data) {
    config['data'] = data
  }
  if (params) {
    config['params'] = params
  }
  return config
}

/**
 *
 * @param {'get'|'post'|'put'|'delete'} method - http method
 * @param {string} url - url
 * @param {Object | null} data - data
 * @param {Object | null} params - params object
 * @returns {import("axios").AxiosRequestConfig<any>} - request config
 */
function makeConfig(
  method,
  url,
  data = null,
  params = null
) {
  const config = makeConfigWithoutAuth(method, url, data, params)
  const authStore = useAuthStore()
  const bearerToken = authStore.bearerToken
  if (bearerToken && bearerToken.length) {
    config['headers'] = { 'Authorization': bearerToken }
  }
  return config
}

/**
 *
 * @param {'post'|'put'} method - http method
 * @param {string} url - url
 * @param {File} file - data
 * @param {Object | null} params - params object
 * @returns {import("axios").AxiosRequestConfig<any>} - request config
 */
function makeFileUploadConfig(
  method,
  url,
  file,
  params = null
) {
  const config = { url: url, method: method }
  if (params) {
    config['params'] = params
  }
  const formData = new FormData()
  formData.append("file", file)
  config['data'] = formData
  const authStore = useAuthStore()
  const bearerToken = authStore.bearerToken
  if (bearerToken && bearerToken.length) {
    config['headers'] = {
      'Authorization': bearerToken,
      'Content-Type': file.type,
    }
  } else {
    config['headers'] = {
      'Content-Type': file.type,
    }
  }
  config.timeout = 30000
  return config
}
