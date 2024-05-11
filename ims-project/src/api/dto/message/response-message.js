export {
  ResponseMessage
}

class ResponseMessage{
  /**
   *
   * @param {string} messageId - message ID
   * @param {string} serverId - server ID
   * @param {number} chatId - chat ID
   * @param {string} content - response content
   * @param {number} localId - message local ID
   */
  constructor(messageId, serverId, chatId, content, localId) {
    this.messageId = messageId
    this.serverId = serverId
    this.chatId = chatId
    this.content = content
    this.localId = localId
  }
}
