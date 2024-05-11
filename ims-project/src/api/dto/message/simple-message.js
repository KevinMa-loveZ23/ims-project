export {
  SimpleChatMessage
}

class SimpleChatMessage{
  /**
   *
   * @param {string} id - message ID
   * @param {string} userId - user ID
   * @param {string} content - message content
   * @param {number} type - message type
   */
  constructor(id, userId, content, type) {
    this.id = id
    this.userId = userId
    this.content = content
    this.type = type
  }
}
