import { AccountModifiablePart } from "src/api/entity/user"
import { getSetArray } from "src/api/map-and-set"

export {
  RequestCreateAccount, RequestModifyAccount, RequestDeleteAccount, RequestAccountNames
}

class RequestCreateAccount{
  /**
   *
   * @param {string} name - user name
   * @param {string} hashedPw - hashed password
   * @param {string} email - email address
   */
  constructor(name, hashedPw, email) {
    this.name = name
    this.hashedPw = hashedPw
    this.email = email
  }
}

class RequestModifyAccount{
  /**
   *
   * @param {string | null} previousPw - hashed previous password
   * @param {string | null} hashedOnePw - hashed new password
   * @param {string | null} name - new user name
   * @param {string | null} email - new email address
   * @param {boolean | null} publishEmail - if publish email address
   * @param {boolean | null} publishServer - if publish server list
   */
  constructor(previousPw, hashedOnePw, name, email, publishEmail, publishServer) {
    this.previousPw = previousPw
    this.hashedOnePw = hashedOnePw
    if (name !== null || email !== null || publishEmail !== null || publishServer !== null) {
      this.accountModifiablePart = new AccountModifiablePart(name, email, publishEmail, publishServer)
    } else {
      this.accountModifiablePart = null
    }
  }
}
class RequestDeleteAccount{
  /**
   *
   * @param {string} hashedPw - hashed password
   */
  constructor(hashedPw) {
    this.hashedOnePw = hashedPw
  }
}

class RequestAccountNames{
  /**
   *
   * @param {Set<bigint>} userIdSet - user ID set
   */
  constructor(userIdSet) {
    this.userIdSet = getSetArray(userIdSet).map((val) => val.toString())
  }
}
