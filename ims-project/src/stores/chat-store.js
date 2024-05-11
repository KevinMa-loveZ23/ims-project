import { defineStore } from "pinia";
import { SimpleChatMessage } from "src/api/dto/message/simple-message";
import { AccountInfoBody } from "src/api/dto/response/response-account";
import { MessageShown } from "src/api/entity/message";
import { Server } from "src/api/entity/server";
import { computed, ref } from "vue";

// class ChatList{
//   /**
//    *
//    * @param {bigint[]} serverIdList - server ID list
//    */
//   constructor(serverIdList) {
//     this.serverIdList = serverIdList
//     this.serverIdList.sort((a,b)=>{return a-b})
//     // /**
//     //  * @type {Map<bigint, Server>}
//     //  */
//     // this.serverMap = new Map()
//     /**
//      * @type {Map<bigint, Map<number, SimpleChatMessage[]>>}
//      */
//     this.messageMap = new Map()
//   }
//   /**
//    *
//    * @param {bigint} serverId - server ID
//    */
//   addServerId(serverId) {
//     this.serverIdList.push(serverId)
//     this.serverIdList.sort((a,b)=>{return a-b})
//   }
//   // /**
//   //  *
//   //  * @param {Server} server - server entity
//   //  */
//   // addServerEntity(server) {
//   //   this.serverMap.set(server.serverId, server)
//   //   if (server.chatMap) {
//   //     this.setChats(server.serverId, Array.from(server.chatMap.keys()))
//   //   }
//   // }
//   /**
//    *
//    * @param {bigint} serverId - server ID
//    * @param {number[]} chatIdList - chat ID list
//    */
//   setChats(serverId, chatIdList) {
//     this.messageMap.set(serverId, new Map())
//     chatIdList.forEach(chatId => {
//       this.messageMap.get(serverId).set(chatId, Array.of())
//     })
//   }
//   /**
//    *
//    * @param {bigint} serverId - server ID
//    * @param {number} chatId - chat ID
//    * @returns {SimpleChatMessage[] | null}
//    */
//   getChatMessages(serverId, chatId) {
//     const list = this.messageMap.get(serverId).get(chatId)
//     return list?list:null
//   }
//   /**
//    *
//    * @param {bigint} serverId - server ID
//    * @param {number} chatId - chat ID
//    * @param {SimpleChatMessage} message - message
//    */
//   addChatMessage(serverId, chatId, message) {
//     this.messageMap.get(serverId).get(chatId).push(message)
//   }
// }

export const useChatStore = defineStore("chatStore", () => {
  // /**
  //  * @type {import("vue").Ref<ChatList>}
  //  */
  // const chatList = ref(null)
  /**
   * @type {import("vue").Ref<AccountInfoBody>}
   */
  const accountInfo = ref(null)
  /**
   * @type {import("vue").Ref<Map<bigInt, string>>}
   */
  const serverNameMap = ref(new Map())
  /**
   * @type {import("vue").Ref<Map<bigint, Map<number, MessageShown[]>>>}
   */
  const messageMap = ref(new Map())

  // const isChatListEmpty = computed(() => chatList.value === null)
  const isAccountInfoEmpty = computed(() => accountInfo.value === null)
  /**
   *
   * @param {AccountInfoBody} accountInfoBody - account info body
   */
  function updateAccountInfo(accountInfoBody) {
    accountInfo.value = accountInfoBody
    // chatList.value = ChatList(accountInfo.value.servers)
  }
  // function getServerIdList() {
  //   if (isChatListEmpty.value) {
  //     return null
  //   } else {
  //     return chatList.value.serverIdList
  //   }
  // }
  // /**
  //  *
  //  * @param {bigint[]} serverIdList - server ID list
  //  */
  // function initChatList(serverIdList) {
  //   chatList.value = new ChatList(serverIdList)
  // }
  // /**
  //  *
  //  * @param {Server} server - server entity
  //  */
  // function updateServerEntity(server) {
  //   chatList.value.addServerEntity(server)
  // }
  /**
   *
   * @param {bigint} serverId - server ID
   * @param {number} chatId - chat ID
   * @returns {MessageShown[] | null}
   */
  function getChatMessageList(serverId, chatId) {
    // if (isChatListEmpty.value) {
    //   return null
    // } else {
    //   return chatList.value.getChatMessages(serverId, chatId)
    // }
    const sMap = messageMap.value.get(serverId)
    if (sMap) {
      const mList = sMap.get(chatId)
      if (mList) {
        return mList
      }
    } else {
      return null
    }
  }
  /**
   *
   * @param {bigint} serverId - server ID
   * @param {number} chatId - chat ID
   * @param {MessageShown} message - message
   * @returns {number} - local ID
   */
  function addChatMessage(serverId, chatId, message) {
    // chatList.value.addChatMessage(serverId, chatId, message)
    const sMap = messageMap.value.get(serverId)
    if (sMap) {
      const mList = sMap.get(chatId)
      if (mList) {
        // console.log(mList)
        mList.push(message)
        // console.log(mList)
        return mList.length - 1
      } else {
        sMap.set(chatId, [message])
      }
    } else {
      messageMap.value.set(serverId, new Map([
        [chatId, [message]]
      ]))
    }
    return 0
  }
  /**
   *
   * @param {bigint} serverId - server ID
   * @param {number} chatId - chat ID
   * @param {number} localId - local ID
   * @param {MessageShown | null} message - message
   */
  function updateChatMessage(serverId, chatId, localId, message) {
    // console.log("Update")
    if (message) {
      messageMap.value.get(serverId).get(chatId)[localId] = message
    } else {
      messageMap.value.get(serverId).get(chatId).splice(localId, 1)
    }
  }
  /**
   *
   * @param {bigint} serverId - server ID
   * @param {number} chatId - chat ID
   * @param {number} localId - local ID
   * @returns {MessageShown}
   */
  function getChatMessageByLocalId(serverId, chatId, localId) {
    return messageMap.value.get(serverId).get(chatId)[localId]
  }
  function clear() {
    // chatList.value = null
    accountInfo.value = null
    serverNameMap.value = new Map()
    messageMap.value = new Map()
  }
  return {
    // chatList,
    accountInfo,
    serverNameMap,
    messageMap,
    // isChatListEmpty,
    isAccountInfoEmpty,
    updateAccountInfo,
    // getServerIdList,
    // initChatList,
    // updateServerEntity,
    getChatMessageList,
    addChatMessage,
    updateChatMessage,
    getChatMessageByLocalId,
    clear
  }
})
