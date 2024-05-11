import { SimpleChatMessage } from "../dto/message/simple-message"

export {
  MessageShown
}

class MessageShown {
  /**
   *
   * @param {bigint} id - message ID
   * @param {bigint} userId - user ID
   * @param {string} content - message content
   * @param {number} type - message type
  //  * @param {number} localId - message local ID
   * @param {boolean} loading - message is loading
   */
  constructor(id, userId, content, type,
    // localId,
    loading
  ) {
    this.id = id
    this.userId = userId
    this.content = content
    this.type = type
    // this.localId = localId
    this.loading = loading
  }
  /**
   *
   * @param {SimpleChatMessage} sMessage - simple chat message
  //  * @param {number} localId - local ID
   * @param {boolean} loading - loading
   * @returns {MessageShown}
   */
  static fromSimpleMessage(sMessage,
    // localId,
    loading = false
  ) {
    return new MessageShown(
      sMessage.id,
      sMessage.userId,
      sMessage.content,
      sMessage.type,
      // localId,
      loading
    )
  }
}
