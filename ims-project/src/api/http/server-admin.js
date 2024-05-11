import { AdminServerAddBody, AdminServerDeleteBody, AdminServerInfoBody } from "../dto/response/response-server-admin";
import { makeConfig, makeRequest } from "./http";

export {
  addAdmin, getAdmins, deleteAdmin
}

/**
 *
 * @param {bigint} serverId - server ID
 * @param {bigint} uid - user ID
 * @returns {Promise<AdminServerAddBody>}
 */
async function addAdmin(serverId, uid) {
  return makeRequest(
    makeConfig('post', `server/${serverId.toString()}/admin/${uid.toString()}`)
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @returns {Promise<AdminServerInfoBody>}
 */
async function getAdmins(serverId) {
  return makeRequest(
    makeConfig('get', `server/${serverId.toString()}/admin`)
  )
}

/**
 *
 * @param {bigint} serverId - server ID
 * @param {bigint} uid - user ID
 * @returns {Promise<AdminServerDeleteBody>}
 */
async function deleteAdmin(serverId, uid) {
  return makeRequest(
    makeConfig('delete', `server/${serverId.toString()}/admin/${uid.toString()}`)
  )
}
