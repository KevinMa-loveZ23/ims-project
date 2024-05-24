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
   * @param {number} type - type
   */
  constructor(messageId, serverId, chatId, content, localId, type) {
    this.messageId = messageId
    this.serverId = serverId
    this.chatId = chatId
    this.content = content
    this.localId = localId
    this.type = type
  }
}
