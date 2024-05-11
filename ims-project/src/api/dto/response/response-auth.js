import { ResponseDataBody } from "./response";

export {
  LogInBody, RenewRefreshTokenBody, LogOutBody
}

class LogInBody extends ResponseDataBody{
  /**
   *
   * @param {string} refreshToken - refresh token (JWS)
   */
  constructor(refreshToken) {
    super()
    this.refreshToken = refreshToken
  }
  isVoid() {
    return this.refreshToken == ""
  }
}

class RenewRefreshTokenBody extends ResponseDataBody{
  /**
   *
   * @param {string} newRefreshToken - new refresh token (JWS)
   */
  constructor(newRefreshToken) {
    super()
    this.newRefreshToken = newRefreshToken
  }
  isVoid() {
    return this.newRefreshToken == ""
  }
}

class LogOutBody extends ResponseDataBody{
  /**
   *
   * @param {boolean} success - if logging out successes
   */
  constructor(success) {
    super()
    this.success = success
  }
  isVoid() {
    return !this.success
  }
}

/**
 * This body only exists in 401 'Unauthorized' Response
 */
class RequireLegalTokenBody extends ResponseDataBody{
  /**
   *
   * @param {boolean} illegalOrExpiredToken - if token is illegal or expired
   */
  constructor(illegalOrExpiredToken) {
    super()
    this.illegalOrExpiredToken = illegalOrExpiredToken
  }
  isVoid() {
    return !this.illegalOrExpiredToken
  }
}
