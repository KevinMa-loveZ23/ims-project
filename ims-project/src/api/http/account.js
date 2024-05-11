import { hashPassword } from "../digester"
import { RequestAccountNames, RequestCreateAccount, RequestDeleteAccount, RequestModifyAccount } from "../dto/request/request-accouont"
import { AccountCreateBody, AccountDeleteBody, AccountInfoBody, AccountModifyBody, AccountNamesBody, AccountServersBody } from "../dto/response/response-account"
import { makeConfig, makeConfigWithoutAuth, makeRequest, makeUncheckRequest } from "./http"

export {
  signIn, getAccountInfo, modifyAccountPassword, modifyAccountInfo, deleteAccount, getMultiNames, getServerNames
}

/**
 *
 * @param {string} eMailAddress - E-Mail Address
 * @param {string} userName - User Name
 * @param {string} password - Password
 * @returns {Promise<AccountCreateBody>} - creating result
 */
async function signIn(eMailAddress, userName, password) {
  const hashedPassword = await hashPassword(password)
  return makeUncheckRequest(
    makeConfigWithoutAuth('post', 'account', new RequestCreateAccount(userName, hashedPassword, eMailAddress)),
    (res) => {
      return res.data.responseBody
    }
  )
}

/**
 *
 * @param {bigint} uid - user ID
 * @returns {Promise<AccountInfoBody>} - info
 */
async function getAccountInfo(uid) {
  return makeRequest(
    makeConfig('get', `account/${uid.toString()}`)
  )
}

/**
 *
 * @param {bigint} uid - user ID
 * @param {string} previousPw - previous password
 * @param {string} newPassword - new password
 * @returns {Promise<AccountModifyBody>}
 */
async function modifyAccountPassword(uid, previousPw, newPassword) {
  const ppw = await hashPassword(previousPw)
  const npw = await hashPassword(newPassword)
  const rma = new RequestModifyAccount(ppw, npw, null, null, null, null)
  return makeRequest(
    makeConfig('put', `account/${uid.toString()}`, rma)
  )
}

/**
 *
 * @param {bigint} uid - user ID
 * @param {string | null} name - user name
 * @param {string | null} email - email address
 * @param {boolean | null} publishEmail - if publish email address
 * @param {boolean | null} publishServer - if publish server list
 * @returns {Promise<AccountModifyBody>}
 */
async function modifyAccountInfo(uid, name, email, publishEmail, publishServer) {
  const rma = new RequestModifyAccount(null, null, name, email, publishEmail, publishServer)
  return makeRequest(
    makeConfig('put', `account/${uid.toString()}`, rma)
  )
}

/**
 *
 * @param {bigint} uid - user ID
 * @param {string} password - password
 * @returns {Promise<AccountDeleteBody>}
 */
async function deleteAccount(uid, password) {
  const hpw = await hashPassword(password)
  return makeRequest(
    makeConfig('delete', `account/${uid.toString()}`, new RequestDeleteAccount(hpw))
  )
}

/**
 *
 * @param {Set<bigint>} userIdSet - user ID set
 * @returns {Promise<AccountNamesBody>}
 */
async function getMultiNames(userIdSet) {
  return makeRequest(
    makeConfig('post', 'account/names', new RequestAccountNames(userIdSet))
  )
}

/**
 *
 * @param {bigint} uid - user ID
 * @returns {Promise<AccountServersBody>}
 */
async function getServerNames(uid) {
  return makeRequest(
    makeConfig('get', `account/${uid.toString()}/servers`)
  )
}
