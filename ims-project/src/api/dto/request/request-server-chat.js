export {
  RequestCreateChat, RequestModifyChatInfo
}

class RequestCreateChat{
  /**
   *
   * @param {string} name - chat name
   */
  constructor(name) {
    this.name = name
  }
}

class RequestModifyChatInfo{
  /**
   *
   * @param {string} name - new chat name
   */
  constructor(name) {
    this.name = name
  }
}
