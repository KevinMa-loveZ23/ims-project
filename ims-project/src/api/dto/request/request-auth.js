export {
  RequestLogIn, RequestRenewRefreshToken
}

class RequestLogIn{
  /**
   *
   * @param {bigint} id - user ID
   * @param {string} hashedPw - hashed password
   */
  constructor(id, hashedPw) {
    this.id = id.toString()
    this.hashedPw = hashedPw
  }
}

class RequestRenewRefreshToken{
  /**
   *
   * @param {string} oldRefreshToken - old refresh token
   */
  constructor(oldRefreshToken) {
    this.oldRefreshToken = oldRefreshToken
  }
}
