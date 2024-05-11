export {
  ClientMessage
}

class ClientMessage{
  /**
   *
   * @param {bigint} serverId - server ID
   * @param {number} chatId - chat ID
   * @param {number} localId - message local ID
   * @param {string} content - message content
   * @param {number} type - message type
   */
  constructor(serverId, chatId, localId, content, type) {
    this.serverId = serverId.toString()
    this.chatId = chatId
    this.localId = localId
    this.content = content
    this.type = type
  }
}
