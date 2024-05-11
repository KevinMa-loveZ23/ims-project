import { getSetArray } from "src/api/map-and-set"

export {
  RequestJoinServer, RequestDeleteMultiMembers
}

class RequestJoinServer{
  /**
   *
   * @param {string} message - join server message
   */
  constructor(message) {
    this.message = message
  }
}

class RequestDeleteMultiMembers{
  /**
   *
   * @param {Set<bigint>} userIdSet - user ID list to be deleted
   */
  constructor(userIdSet) {
    this.userIdList = getSetArray(userIdSet).map((val) => val.toString())
  }
}
