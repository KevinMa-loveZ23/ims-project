import { RequestDeleteMultiMembers, RequestJoinServer } from "../dto/request/request-server-member";
import { ListMessageEntryGetBody, ListWaitingGetBody, MemberDeleteBody, MemberMultiDeleteBody, MembersGetBody, MessageEntryAddBody, MessageEntryDeleteBody, ServerJoinAllowBody, ServerJoinRequestBody } from "../dto/response/response-server-member";
import { makeConfig, makeRequest } from "./http";

export {
  requestJoinServer, getWaitingList, allowJoinServer, getMembers, deleteMember, deleteMultiMembers, getEntryMessageList, addEntryMessage, deleteEntryMessage
}

/**
 *
 * @param {bigint} serverId - server ID
 * @param {0 | 1 | null} code - code (0 for code message check, 1 for admin check, null for 0)
 * @param {string} message - message
 * @returns {Promise<ServerJoinRequestBody>}
 */
async function requestJoinServer(serverId, code, message) {
  const params = code?{code: code}:null
  return makeRequest(
    makeConfig('put', `server/${serverId.toString()}/member`, new RequestJoinServer(message), params)
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @returns {Promise<ListWaitingGetBody>}
 */
async function getWaitingList(serverId) {
  return makeRequest(
    makeConfig('get', `server/${serverId}/member/waiting`)
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @param {bigint} uid - user ID
 * @returns {Promise<ServerJoinAllowBody>}
 */
async function allowJoinServer(serverId, uid) {
  return makeRequest(
    makeConfig('put', `server/${serverId.toString()}/member/${uid.toString()}`)
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @returns {Promise<MembersGetBody>}
 */
async function getMembers(serverId) {
  return makeRequest(
    makeConfig('get', `server/${serverId.toString()}/member`)
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @param {bigint} uid - user ID
 * @returns {Promise<MemberDeleteBody>}
 */
async function deleteMember(serverId, uid) {
  return makeRequest(
    makeConfig('delete', `server/${serverId.toString()}/member/${uid.toString()}`)
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @param {Set<bigint>} userIdSet - user ID set
 * @returns {Promise<MemberMultiDeleteBody>}
 */
async function deleteMultiMembers(serverId, userIdSet) {
  return makeRequest(
    makeConfig('delete', `server/${serverId.toString()}/member`, new RequestDeleteMultiMembers(userIdSet))
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @returns {Promise<ListMessageEntryGetBody>}
 */
async function getEntryMessageList(serverId) {
  return makeRequest(
    makeConfig('get', `server/${serverId.toString()}/member/code`)
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @param {string} eMsg - entry message
 * @returns {Promise<MessageEntryAddBody>}
 */
async function addEntryMessage(serverId, eMsg) {
  return makeRequest(
    makeConfig('post', `server/${serverId.toString()}/member/code`, null, {msg: eMsg})
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @param {string} eMsg - entry message to be deleted
 * @returns {Promise<MessageEntryDeleteBody>}
 */
async function deleteEntryMessage(serverId, eMsg) {
  return makeRequest(
    makeConfig('delete', `server/${serverId.toString()}/member/code`, null, {msg: eMsg})
  )
}
