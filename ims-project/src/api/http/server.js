import { RequestCreateServer, RequestModifyServer, RequestDeleteServer } from "../dto/request/request-server";
import { ServerCreateBody, ServerInfoBody, ServerModifyBody, ServerDeleteBody } from "../dto/response/response-server";
import { makeRequest, makeConfig } from "./http";

export {
  createServer, getServerInfo, modifyServer, deleteServer
}

/**
 *
 * @param {string} name - server name
 * @param {string} description - server description
 * @returns {Promise<ServerCreateBody>}
 */
async function createServer(name, description) {
  return makeRequest(
    makeConfig('post', 'server', new RequestCreateServer(name, description))
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @returns {Promise<ServerInfoBody>}
 */
async function getServerInfo(serverId) {
  return makeRequest(
    makeConfig('get', `server/${serverId.toString()}`)
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @param {string | null} name - server name
 * @param {bigint | null} owner - server owner
 * @param {string | null} description - server description
 * @returns {Promise<ServerModifyBody>}
 */
async function modifyServer(serverId, name, owner, description) {
  const ownerStr = owner?owner.toString():null
  return makeRequest(
    makeConfig('put', `server/${serverId.toString()}`, new RequestModifyServer(name, ownerStr, description))
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @returns {Promise<ServerDeleteBody>}
 */
async function deleteServer(serverId) {
  return makeRequest(
    makeConfig('delete', `server/${serverId.toString()}`, new RequestDeleteServer(null))
  )
}
