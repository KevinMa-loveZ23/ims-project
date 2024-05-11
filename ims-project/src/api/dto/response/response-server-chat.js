import { Chat } from "src/api/entity/chat";
import { ResponseDataBody } from "./response";
import { SimpleChatMessage } from "../message/simple-message";

export {
  ImageUploadBody, ChatCreateBody, ListChatGetBody, InfoChatModifyBody, ChatDeleteBody, MessageHistoryGetBody
}

class ImageUploadBody extends ResponseDataBody{
  /**
   *
   * @param {string | null} messageId - message ID
   * @param {string} fileName - file name
   */
  constructor(messageId, fileName) {
    super()
    this.messageId = messageId
    this.fileName = fileName
  }
  isVoid() {
    return this.messageId === null
  }
}

class ChatCreateBody extends ResponseDataBody{
  /**
   *
   * @param {number} chatId - chat ID
   */
  constructor(chatId) {
    super()
    this.chatId = chatId
  }
  isVoid() {
    return this.chatId == -1
  }
}

class ListChatGetBody extends ResponseDataBody{
  /**
   *
   * @param {Array<Chat>} chatNameList - chat list
   */
  constructor(chatNameList) {
    super()
    this.chatNameList = chatNameList
  }
  isVoid() {
    return this.chatNameList.length == 0
  }
}

class InfoChatModifyBody extends ResponseDataBody{
  /**
   *
   * @param {string} chatName - chat name
   */
  constructor(chatName) {
    super()
    this.chatName = chatName
  }
  isVoid() {
    return this.chatName.length == 0
  }
}

class ChatDeleteBody extends ResponseDataBody{
  /**
   *
   * @param {boolean} success - if deleting chat success
   */
  constructor(success) {
    super()
    this.success = success
  }
  isVoid() {
    return !this.success
  }
}

class MessageHistoryGetBody extends ResponseDataBody{
  /**
   *
   * @param {SimpleChatMessage[]} messageList - simple message list
   */
  constructor(messageList) {
    super()
    this.messageList = messageList
  }
  isVoid() {
    return this.messageList.length == 0
  }
}
