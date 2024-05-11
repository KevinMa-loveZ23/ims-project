export {
  ForwardMessage
}

class ForwardMessage{
  /**
   *
   * @param {string} id - message ID
   * @param {string} serverId - server ID
   * @param {number} chatId - chat ID
   * @param {string} userId - user ID
   * @param {string} content - message content
   * @param {number} type - message type
   */
  constructor(id, serverId, chatId, userId, content, type) {
    this.id = id
    type.serverId = serverId
    this.chatId = chatId
    this.userId = userId
    this.content = content
    this.type = type
  }
}
