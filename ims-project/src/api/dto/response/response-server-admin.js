import { ResponseDataBody } from "./response";

export {
  AdminServerAddBody, AdminServerInfoBody, AdminServerDeleteBody
}

class AdminServerAddBody extends ResponseDataBody{
  /**
   *
   * @param {boolean} success - if adding admin success
   */
  constructor(success) {
    super()
    this.success = success
  }
  isVoid() {
    return !this.success
  }
}

class AdminServerInfoBody extends ResponseDataBody{
  /**
   *
   * @param {Object | null} adminIdNameMap - admin ID-name map (object format)
   */
  constructor(adminIdNameMap) {
    super()
    this.adminIdNameMap = adminIdNameMap
  }
  isVoid() {
    return this.adminIdNameMap === null
  }
}

class AdminServerDeleteBody extends ResponseDataBody{
  /**
   *
   * @param {boolean} success - if deleting admin success
   */
  constructor(success) {
    super()
    this.success = success
  }
  isVoid() {
    return !this.success
  }
}
