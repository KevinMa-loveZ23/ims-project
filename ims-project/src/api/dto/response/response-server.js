import { ServerModifiablePart } from "src/api/entity/server";
import { ResponseDataBody } from "./response";

export {
  ServerCreateBody, ServerInfoBody, ServerModifyBody, ServerDeleteBody
}

class ServerCreateBody extends ResponseDataBody{
  /**
   *
   * @param {string} serverId - server ID
   * @param {string} name - server name
   * @param {string} owner - server owner ID
   */
  constructor(serverId, name, owner) {
    super()
    this.serverId = serverId
    this.name = name
    this.owner = owner
  }
  isVoid() {
    return this.serverId == "-1"
  }
}

class ServerInfoBody extends ResponseDataBody{
  /**
   *
   * @param {string} serverId - server ID
   * @param {string} name - server name
   * @param {string} owner - server owner ID
   * @param {string} description - server description
   */
  constructor(serverId, name, owner, description) {
    super()
    this.serverId = serverId
    this.name = name
    this.owner = owner
    this.description = description
  }
  isVoid() {
    return this.serverId == "-1"
  }
}

class ServerModifyBody extends ResponseDataBody{
  /**
   *
   * @param {ServerModifiablePart} serverModifiablePart - server status after modifying
   */
  constructor(serverModifiablePart) {
    super()
    this.serverModifiablePart = serverModifiablePart
  }
  isVoid() {
    return this.serverModifiablePart.name === null
      && this.serverModifiablePart.owner === null
      && this.serverModifiablePart.description === null
  }
}

class ServerDeleteBody extends ResponseDataBody{
  /**
   *
   * @param {string} serverId - server ID
   */
  constructor(serverId) {
    super()
    this.serverId = serverId
  }
  isVoid() {
    return this.serverId == "-1"
  }
}
