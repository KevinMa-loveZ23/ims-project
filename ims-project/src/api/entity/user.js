export {
  User, AccountModifiablePart, UserName, getName, updateName, updateNameWithList
}

class User{
  /**
   *
   * @param {bigint} uid - user ID
   * @param {string} name - user name
   * @param {string | null} email - user email address
   * @param {boolean | null} publishEmail - if user publish email address
   * @param {bigint[] | null} servers - server list of user
   * @param {boolean | null} publishServer - if user publish server list
   * @param {number | null} serverCreateTimes - number of server(s) user can create
   */
  constructor(uid, name, email, publishEmail, servers, publishServer, serverCreateTimes) {
    this.uid = uid
    this.name = name
    this.email = email
    this.publishEmail = publishEmail
    this.servers = servers
    this.publishServer = publishServer
    this.serverCreateTimes = serverCreateTimes
  }
}

class AccountModifiablePart{
  /**
   *
   * @param {string | null} name - new user name
   * @param {string | null} email - new email address
   * @param {boolean | null} publishEmail - if publish email address
   * @param {boolean | null} publishServer - if publish server list
   */
  constructor(name, email, publishEmail, publishServer) {
    this.name = name
    this.email = email
    this.publishEmail = publishEmail
    this.publishServer = publishServer
  }
}

class UserName{
  /**
   *
   * @param {bigint} uid - user ID
   * @param {string} name - user name
   */
  constructor(uid, name) {
    this.uid = uid
    this.name = name
  }
}
/**
 * @type {Map<bigint, string>}
 */
const userNameMap = new Map()

/**
 *
 * @param {bigint} uid - user ID
 * @returns {string | null} - user name or null
 */
function getName(uid) {
  const name = userNameMap.get(uid)
  return name?name:null
}
/**
 *
 * @param {bigint} uid - user ID
 * @param {string} name - user name
 */
function updateName(uid, name) {
  userNameMap.set(uid, name)
}
/**
 *
 * @param {UserName[]} userNames - list of user {ID and name}(s)
 */
function updateNameWithList(userNames) {
  userNames.forEach((un) => {
    userNameMap.set(un.uid, un.name)
  })
}
