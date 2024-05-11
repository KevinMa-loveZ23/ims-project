import { AccountModifiablePart } from "src/api/entity/user"
import { ResponseDataBody } from "./response"

export {
  AccountCreateBody, AccountInfoBody, AccountModifyBody, AccountDeleteBody, AccountNamesBody, AccountServersBody
}

class AccountCreateBody extends ResponseDataBody{
  constructor(id, name) {
    super()
    this.id = id,
    this.name = name
  }
  isVoid() {
    return this.id == "-1"
  }
}

class AccountInfoBody extends ResponseDataBody{
  /**
   *
   * @param {string} id - user ID
   * @param {string} name - user name
   * @param {string | null} email - user email address
   * @param {boolean | null} publishEmail - if user publish email address
   * @param {string[] | null} servers - server list
   * @param {boolean | null} publishServer - if user publish server list
   * @param {number | null} serverCreateTimes - number of server(s) user can create
   */
  constructor(id, name, email, publishEmail, servers, publishServer, serverCreateTimes) {
    super()
    this.id = id
    this.name = name
    this.email = email
    this.publishEmail = publishEmail
    this.servers = servers
    this.publishServer = publishServer
    this.serverCreateTimes = serverCreateTimes
  }
  isVoid() {
    return this.id == "-1"
  }
}

class AccountModifyBody extends ResponseDataBody{
  /**
   *
   * @param {boolean} passwordModified - if password is modified
   * @param {AccountModifiablePart | null} modifiablePart - account status after modifying
   */
  constructor(passwordModified, modifiablePart) {
    super()
    this.passwordModified = passwordModified
    this.modifiablePart = modifiablePart
  }
  isVoid() {
    return this.passwordModified == false || this.modifiablePart === null
  }
}

class AccountDeleteBody extends ResponseDataBody{
  /**
   *
   * @param {string} id - user ID
   */
  constructor(id) {
    super()
    this.id = id
  }
  isVoid() {
    return this.id == "-1"
  }
}

class AccountNamesBody extends ResponseDataBody{
  /**
   *
   * @param {Object} nameMap - name map object (user ID-name)
   */
  constructor(nameMap) {
    super()
    this.nameMap = nameMap
  }
  isVoid() {
    return this.nameMap === null
  }
}

class AccountServersBody extends ResponseDataBody{
  /**
   *
   * @param {Object} serverNameMap - server map object (ID-name)
   */
  constructor(serverNameMap) {
    super()
    this.serverNameMap = serverNameMap
  }
  isVoid() {
    return this.serverNameMap === null
  }
}
