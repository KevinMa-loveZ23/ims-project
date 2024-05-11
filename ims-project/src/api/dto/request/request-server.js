import { ServerModifiablePart } from "src/api/entity/server"

export {
  RequestCreateServer, RequestModifyServer, RequestDeleteServer
}

class RequestCreateServer{
  /**
   *
   * @param {string} name - server name
   * @param {string} description - server description
   */
  constructor(name, description) {
    this.name = name
    this.description = description
  }
}

class RequestModifyServer{
  /**
   *
   * @param {string | null} name - new server name
   * @param {string | null} owner - new server owner
   * @param {string | null} description - new server description
   */
  constructor(name, owner, description) {
    this.serverModifiablePart = new ServerModifiablePart(name, owner, description)
  }
}

class RequestDeleteServer{
  /**
   *
   * @param {string | null} hashedPw - hashed password of owner
   */
  constructor(hashedPw) {
    this.hashedPw = hashedPw
  }
}


