export {
  Server, ServerModifiablePart
}

class Server{
  /**
   *
   * @param {bigint} serverId - server ID
   * @param {string} name - server name
   * @param {bigint} owner - owner ID
   * @param {string} description - server description
   */
  constructor(serverId, name, owner, description) {
    this.serverId = serverId
    this.name = name
    this.owner = owner
    this.description = description
  }
  /**
   *
   * @param {Map<number, string>} chatMap - server chat ID-name map
   */
  updateChatMap(chatMap) {
    this.chatMap = chatMap
  }
  /**
   *
   * @param {Map<bigint, string>} adminMap - server admin ID-name map
   */
  updateAdminMap(adminMap) {
    this.adminMap = adminMap
  }
}

class ServerModifiablePart{
  /**
   *
   * @param {string | null} name - server name
   * @param {string | null} owner - owner ID
   * @param {string | null} description - server description
   */
  constructor(name, owner, description) {
    this.name = name
    this.owner = (owner || owner == 0)?owner.toString():null
    this.description = description
  }
}
