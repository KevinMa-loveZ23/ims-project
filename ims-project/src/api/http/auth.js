import { HttpStatusCode } from "axios";
import { hashPassword } from "../digester";
import { RequestLogIn, RequestRenewRefreshToken } from "../dto/request/request-auth";
import { StdResponse } from "../dto/response/response";
import { axiosInstance, makeConfig, makeConfigWithoutAuth, makeRequest, makeUncheckRequest } from "./http";
import { LogInBody, LogOutBody, RenewRefreshTokenBody } from "../dto/response/response-auth";
import { RequestCreateAccount } from "../dto/request/request-accouont";

export {
  logIn, renewRefreshToken, logOut
}

/**
 *
 * @param {bigint} uid - user ID
 * @param {string} password - password
 * @param {string} failMessage - message when failure catched
 * @param {string} mismatchMessage - message when account or (and) password mismatch
 * @returns {Promise<string>} - refresh token (JWS)
 */
async function logIn(uid, password, failMessage, mismatchMessage) {
  const hashedPassword = await hashPassword(password)
  // return axiosInstance.post(
  //   'auth/login',
  //   new RequestLogIn(uid, hashedPassword)
  // ).then((response) => {
  //   return "test"
  //   /**
  //    * @type {StdResponse}
  //    */
  //   const responseData = response.data
  //   if (responseData.httpStatusCode == HttpStatusCode.Ok) {
  //     /**
  //      * @type {LogInBody}
  //      */
  //     const logInBody = responseData.responseBody
  //     return logInBody.refreshToken
  //   } else {
  //     throw new Error(responseData.info)
  //   }
  // }).catch((error) => {
  //   //
  //   throw new Error(error.toString())
  // })
  return makeUncheckRequest(
    makeConfigWithoutAuth('post', 'auth/login', new RequestLogIn(uid, hashedPassword)),
    (res) => {
      /**
       * @type {LogInBody}
       */
      const body = res.data.responseBody
      return body.refreshToken
    },
    (errRes, msg = failMessage) => {
      if (errRes.status == HttpStatusCode.Forbidden) {
        throw new Error(mismatchMessage)
      }
      /**
       * @type {StdResponse}
       */
      const errResData = errorResponse.data
      throw new Error(errResData.info?errResData.info:msg)
    }
  )
}

/**
 *
 * @param {string} oldRefreshToken - old refresh token (JWS)
 * @returns {Promise<string>} - new refresh token (JWS)
 */
async function renewRefreshToken(oldRefreshToken) {
  return makeUncheckRequest(
    makeConfigWithoutAuth('post', 'auth/refresh', new RequestRenewRefreshToken(oldRefreshToken)),
    (res) => {
      /**
       * @type {RenewRefreshTokenBody}
       */
      const body = res.responseBody
      return body.newRefreshToken
    },
  )
}

/**
 *
 * @returns {Promise<boolean>} - log out success
 */
async function logOut() {
  return makeRequest(
    makeConfig('delete', 'auth/logout'),
    (res) => {
      /**
       * @type {LogOutBody}
       */
      const body = res.responseBody
      return body.success
    }
  )
}
