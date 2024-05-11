import { ResponseDataBody } from "./response";

export {
  ServerJoinRequestBody, ListWaitingGetBody, ServerJoinAllowBody, MembersGetBody, MemberDeleteBody, MemberMultiDeleteBody, ListMessageEntryGetBody, MessageEntryAddBody, MessageEntryDeleteBody
}

class ServerJoinRequestBody extends ResponseDataBody{
  /**
   *
   * @param {boolean} success - if join request sent
   */
  constructor(success) {
    super()
    this.success = success
  }
  isVoid() {
    return !this.success
  }
}

class ListWaitingGetBody extends ResponseDataBody{
  /**
   *
   * @param {Object | null} waitingList - waiting list (user ID-message map object)
   */
  constructor(waitingList) {
    super()
    this.waitingList = waitingList
  }
  isVoid() {
    return this.waitingList === null
  }
}

class ServerJoinAllowBody extends ResponseDataBody{
  /**
   *
   * @param {boolean} success - if join request sent
   */
  constructor(success) {
    super()
    this.success = success
  }
  isVoid() {
    return !this.success
  }
}

class MembersGetBody extends ResponseDataBody{
  /**
   *
   * @param {string[]} userIdList - user ID list
   */
  constructor(userIdList) {
    super()
    this.userIdList = userIdList
  }
  isVoid() {
    return this.userIdList.length == 0
  }
}

class MemberDeleteBody extends ResponseDataBody{
  /**
   *
   * @param {boolean} success - if join request sent
   */
  constructor(success) {
    super()
    this.success = success
  }
  isVoid() {
    return !this.success
  }
}

class MemberMultiDeleteBody extends ResponseDataBody{
  /**
   *
   * @param {boolean} success - if join request sent
   */
  constructor(success) {
    super()
    this.success = success
  }
  isVoid() {
    return !this.success
  }
}

class ListMessageEntryGetBody extends ResponseDataBody{
  /**
   *
   * @param {string[]} entryMessageList - entry message list
   */
  constructor(entryMessageList) {
    super()
    this.entryMessageList = entryMessageList
  }
  isVoid() {
    return this.entryMessageList.length == 0
  }
}

class MessageEntryAddBody extends ResponseDataBody{
  /**
   *
   * @param {boolean} success - if join request sent
   */
  constructor(success) {
    super()
    this.success = success
  }
  isVoid() {
    return !this.success
  }
}

class MessageEntryDeleteBody extends ResponseDataBody{
  /**
   *
   * @param {boolean} success - if join request sent
   */
  constructor(success) {
    super()
    this.success = success
  }
  isVoid() {
    return !this.success
  }
}
