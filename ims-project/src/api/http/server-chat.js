import { RequestCreateChat, RequestModifyChatInfo } from "../dto/request/request-server-chat"
import { ChatCreateBody, ChatDeleteBody, ImageUploadBody, InfoChatModifyBody, ListChatGetBody, MessageHistoryGetBody } from "../dto/response/response-server-chat"
import { axiosInstance, makeConfig, makeFileUploadConfig, makeRequest, makeSimpleRequest } from "./http"

export {
  uploadImageMessage, getImage, createChat, getChatList, modifyChatInfo, deleteChat, getHistoryMessage
}

/**
 *
 * @param {File} imageFile - image file
 * @param {bigint} serverId - server ID
 * @param {number} chatId - chat ID
 * @returns {Promise<ImageUploadBody>}
 */
async function uploadImageMessage(imageFile, serverId, chatId) {
  return makeRequest(
    makeFileUploadConfig('post', `server/${serverId.toString()}/chat/${chatId.toString()}/img`, imageFile)
  )
}

// /**
//  *
//  * @param {bigint} serverId - server ID
//  * @param {number} chatId - chat ID
//  * @param {string} imgFullName - image file full name
//  * @returns {Promise<>}
//  */
// async function getImage(serverId, chatId, imgFullName) {
//   return makeRequest(
//     makeConfig('get', `server/${serverId}/chat/${chatId}/img/${imgFullName}`)
//   )
// }

/**
 *
 * @param {bigint} serverId - server ID
 * @param {number} chatId - chat ID
 * @param {string} imgFullName - image file full name
 * @returns {Promise<File>}
 */
async function getImage(serverId, chatId, imgFullName) {
  const imgUrlSafeName = encodeURIComponent(imgFullName)
  // const config = makeConfig('get', `server/${serverId}/chat/${chatId}/img/${imgFullName}`)
  const config = makeConfig('get', `server/${serverId}/chat/${chatId}/img/${imgUrlSafeName}`)
  // config.responseType = 'blob'
  config.responseType = 'arraybuffer'
  return makeSimpleRequest(
    config,
    (response) => {
      const contentDisposition = response.headers['Content-Disposition']
      let fileName = ''
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="(.+)"/)
        if (matches && matches.length > 1) {
          fileName = decodeURIComponent(matches[1])
        }
      }
      if (!fileName.length) {
        fileName = imgFullName
      }
      return new File([response.data], fileName, { type: response.headers["Content-Type"] })
    }
  )
}

/**
 *
 * @param {string} chatName - chat name
 * @param {bigint} serverId - server ID
 * @returns {Promise<ChatCreateBody>}
 */
async function createChat(chatName, serverId) {
  return makeRequest(
    makeConfig('post', `server/${serverId.toString()}/chat`, new  RequestCreateChat(chatName))
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @returns {Promise<ListChatGetBody>}
 */
async function getChatList(serverId) {
  return makeRequest(
    makeConfig('get', `server/${serverId.toString()}/chat`)
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @param {number} chatId - chat ID
 * @param {string} chatName - chat name
 * @returns {Promise<InfoChatModifyBody>}
 */
async function modifyChatInfo(serverId, chatId, chatName) {
  return makeRequest(
    makeConfig('put', `server/${serverId.toString()}/chat/${chatId.toString()}`, new RequestModifyChatInfo(chatName))
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @param {number} chatId - chat ID
 * @returns {Promise<ChatDeleteBody>}
 */
async function deleteChat(serverId, chatId) {
  return makeRequest(
    makeConfig('delete', `server/${serverId.toString()}/chat/${chatId.toString()}`)
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @param {number} chatId - chat ID
 * @param {number | null} until - timestamp in msec until value (null as present)
 * @param {number | null} num - number of request message (null as 20)
 * @returns {Promise<MessageHistoryGetBody>}
 */
async function getHistoryMessage(serverId, chatId, until, num) {
  let anyNonEmpty = false
  let params = {}
  if (until) {
    params['until'] = until
    anyNonEmpty = true
  }
  if (num) {
    params['num'] = num
    anyNonEmpty = true
  }
  if (!anyNonEmpty) {
    params = null
  }
  return makeRequest(
    makeConfig('get', `server/${serverId}/chat/${chatId}/message`, null, params)
  )
}
