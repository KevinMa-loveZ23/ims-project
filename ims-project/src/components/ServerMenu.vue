<template>
  <DialogError
    v-model="dialogErrorShown"
    :title="dialogErrorTitle"
    :content="dialogErrorContent"
    :onHide="dialogErrorCallback"
  />
  <q-list>
    <q-expansion-item
      v-model="chatExpand"
      expand-separator
      icon="chat"
      :label="chatStr"
    >
      <q-separator />
      <div
        v-show="userIsAdmin"
      >
        <q-item
          clickable
          target="_blank"
          @click="showDialogManageChat = true"
        >
          <q-item-section avatar>
            <q-icon name="tune" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ chatManageStr }}</q-item-label>
          </q-item-section>
          <DialogManageChat
            v-model="showDialogManageChat"
            :chat-map="chatMap"
            :server-id="serverId"
            @update-chat-list="updateChatList"
          />
        </q-item>
        <q-separator spaced />
      </div>
      <q-item
        clickable
        v-for="chatId in chatIdList"
        :key="chatId"
        @click="routeTo(chatId)"
      >
        {{ chatMap.get(chatId) }}
      </q-item>
    </q-expansion-item>
    <q-expansion-item
      v-model="serverInfoExpand"
      expand-separator
      icon="dns"
      :label="serverInfoStr"
    >
      <q-separator />
      <q-item>
        <q-card style="width: 100%;">
          <q-card-actions>
            <q-space />
            <q-toggle v-model="isAbleToLeaveServer" color="red" />
            <q-btn
              flat
              color="red"
              @click="showDialogLeaveServer = true"
              :disable="!isAbleToLeaveServer"
            >
              {{ isUserOwner ? deleteServerStr : leaveServerStr }}
              <q-dialog
                v-model="showDialogLeaveServer"
                persistent
              >
                <q-card>
                  <q-bar>
                    <q-space />
                    <q-btn
                      flat
                      icon="close"
                      :disable="leavingServer"
                      v-close-popup
                    ></q-btn>
                  </q-bar>
                  <q-card-section>
                    {{ isUserOwner? doYouReallyWantToDeleteServerStr : doYouReallyWantToLeaveServerStr }}
                  </q-card-section>
                  <q-card-actions>
                    <q-btn
                      color="red"
                      :disable="leavingServer"
                      @click="isUserOwner?tryDeleteServer():tryLeaveServer()"
                    >{{ YesStr }}</q-btn>
                    <q-space />
                    <q-btn
                      :disable="leavingServer"
                      v-close-popup
                    >{{ cancelStr }}</q-btn>
                  </q-card-actions>
                  <q-inner-loading :showing="leavingServer" />
                </q-card>
              </q-dialog>
            </q-btn>
          </q-card-actions>
          <q-separator />
          <q-card-section>
            <div class="column">
              <div>{{ serverIdStr }}: {{ serverId }}</div>
              <div>
                {{ serverNameStr }}: {{ serverInfo?serverInfo.name:"" }}
              </div>
              <div>
                {{ ownerStr }}: {{ adminMap.get(serverInfo?serverInfo.owner:"-1") }} ({{ serverInfo?serverInfo.owner:"-1" }})
              </div>
              <div>
                {{ descriptionStr }}: {{ serverInfo?serverInfo.description:"" }}
              </div>
            </div>
            <q-inner-loading :showing="gettingServerInfo" />
          </q-card-section>
          <div v-show="userIsAdmin">
            <q-separator />
            <q-card-actions vertical>
              <q-btn
                @click="showDialogManageServer = true"
              >
                {{ modifyStr }}
                <DialogManageServer
                  v-model="showDialogManageServer"
                  :server-info="serverInfo"
                  :is-user-owner="isUserOwner"
                  :admin-map="adminMap"
                  @upload-modify-server-info="updateServerNameAndDescription"
                />
              </q-btn>
            </q-card-actions>
          </div>
        </q-card>
      </q-item>
    </q-expansion-item>
    <q-expansion-item
      v-model="memberExpand"
      expand-separator
      icon="people"
      :label="membersStr"
    >
      <div
        v-show="userIsAdmin"
      >
        <q-item
          clickable
          @click="showServerVerify = true"
        >
          <div class="row flex-center">
            <div><q-avatar><q-icon name="checklist" /></q-avatar></div>
            <div>{{ manageVerificationStr }}</div>
          </div>
          <DialogServerVerify
            v-model="showServerVerify"
            :serverId="serverId"
            @add-member="verifyAddMember"
          />
        </q-item>
        <q-separator spaced />
      </div>
      <q-bar>
        <div>{{ adminsStr }}</div>
        <q-space />
        <div
          v-show="isUserOwner"
          class="row no-warp"
        >
          <q-btn flat color="blue" @click="showDialogAddAdmin = true">
            {{ addAdminStr }}
            <q-dialog
              v-model="showDialogAddAdmin"
            >
              <q-card>
                <q-card-section>
                  <q-scroll-area style="min-width: 20vw; height: 30vh;">
                    <q-list bordered separator>
                      <q-item
                        v-for="mem in memberIdList"
                        :key="mem"
                      >
                        <div class="row no-warp" style="width: 100%;">
                          <div>{{ normalNameMap.get(mem.toString())
                            ? `${normalNameMap.get(mem.toString())} (${mem})`
                            : mem }}</div>
                          <q-space />
                          <q-btn
                            @click="confirmAddAdmin(mem)"
                          >
                            {{ addAdminStr }}
                            <q-dialog
                              v-model="showDialogSecondaryAddAdmin"
                            >
                              <q-card>
                                <q-card-section>
                                  {{ `${doYouReallyWantToAddAdminStr} (${selectAdmin})` }}
                                </q-card-section>
                                <q-card-actions>
                                  <q-btn
                                    v-close-popup
                                  >{{ cancelStr }}</q-btn>
                                  <q-space />
                                  <q-btn
                                    @click="tryAddAdmin()"
                                    color="green"
                                  >{{ addAdminStr }}</q-btn>
                                </q-card-actions>
                                <q-inner-loading :showing="addingAdmin" />
                              </q-card>
                            </q-dialog>
                          </q-btn>
                        </div>
                      </q-item>
                    </q-list>
                  </q-scroll-area>
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-btn>
          <q-btn flat color="red" @click="showDialogDeleteAdmin = true">
            {{ deleteAdminStr }}
            <q-dialog v-model="showDialogDeleteAdmin">
              <q-card>
                <q-card-section>
                  <q-scroll-area style="min-width: 20vw; height: 30vh;">
                    <q-list bordered separator>
                      <q-item
                        v-for="admin in deletableAdmin"
                        :key="admin"
                      >
                        <div class="row no-warp" style="width: 100%;">
                          <div>{{`${adminMap.get(admin.toString())} (${admin})` }}</div>
                          <q-space />
                          <q-btn
                            @click="confirmDeleteAdmin(admin)"
                          >
                            {{ deleteAdminStr }}
                            <q-dialog
                              v-model="showDialogSecondaryDeleteAdmin"
                            >
                              <q-card>
                                <q-card-section>
                                  {{ `${doYouReallyWantToDeleteAdminStr} (${selectDeleteAdmin})` }}
                                </q-card-section>
                                <q-card-actions>
                                  <q-btn
                                    v-close-popup
                                  >{{ cancelStr }}</q-btn>
                                  <q-space />
                                  <q-btn
                                    @click="tryDeleteAdmin"
                                    color="red"
                                  >{{ deleteStr }}</q-btn>
                                </q-card-actions>
                                <q-inner-loading :showing="deletingAdmin" />
                              </q-card>
                            </q-dialog>
                          </q-btn>
                        </div>
                      </q-item>
                    </q-list>
                  </q-scroll-area>
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-btn>
        </div>
      </q-bar>
      <AccountItem
        v-for="aid in adminIdList"
        :key="aid"
        :uid="aid"
        :uname="adminMap.get(aid.toString())"
      />
      <q-separator />
      <q-expansion-item
        v-model="normalMemberExpand"
        expand-separator
        :label="normalMembersStr"
      >
        <q-bar
          v-show="userIsAdmin"
        >
          <q-space />
          <q-btn
            flat
            @click="showDialogDeleteMember = true"
          >
            {{ deleteMemberStr }}
            <q-dialog
              v-model="showDialogDeleteMember"
            >
              <q-card>
                <q-card-section>
                  <q-scroll-area style="min-width: 20vw; height: 30vh;">
                    <q-list bordered separator>
                      <q-item
                        v-for="mem in memberIdList"
                        :key="mem"
                      >
                        <div class="row no-warp" style="width: 100%;">
                          <div>{{ normalNameMap.get(mem.toString())
                            ? `${normalNameMap.get(mem.toString())} (${mem})`
                            : mem }}</div>
                          <q-space />
                          <q-btn
                            @click="confirmDeleteMember(mem)"
                          >
                            {{ deleteStr }}
                            <q-dialog
                              v-model="showDialogSecondaryDeleteMember"
                            >
                              <q-card>
                                <q-card-section>
                                  {{ `${doYouReallyWantToDeleteMemberStr} (${selectDeleteMember})` }}
                                </q-card-section>
                                <q-card-actions>
                                  <q-btn
                                    v-close-popup
                                  >{{ cancelStr }}</q-btn>
                                  <q-space />
                                  <q-btn
                                    @click="tryDeleteMember()"
                                    color="red"
                                  >{{ deleteStr }}</q-btn>
                                </q-card-actions>
                                <q-inner-loading :showing="deletingMember" />
                              </q-card>
                            </q-dialog>
                          </q-btn>
                        </div>
                      </q-item>
                    </q-list>
                  </q-scroll-area>
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-btn>
        </q-bar>
        <AccountItem
          v-for="member in memberIdList"
          :key="member"
          :uid="member"
          :uname="''"
        />
        <q-inner-loading :showing="gettingMemberList"/>
      </q-expansion-item>
    </q-expansion-item>
  </q-list>
</template>

<script setup>
const props = defineProps({
  serverId: {
    type: BigInt,
    required: true
  },
  uid: {
    type: BigInt,
    required: true
  }
})
import { ServerInfoBody } from "src/api/dto/response/response-server";
import AccountItem from "./AccountItem.vue"
import { deleteServer, getServerInfo } from "src/api/http/server";
import { addAdmin, deleteAdmin, getAdmins } from "src/api/http/server-admin";
import { getMapFromObject, getSetFromArray } from "src/api/map-and-set";
import { computed } from "vue";
import { watch, ref } from "vue";
import { useI18n } from "vue-i18n";
import CustomPopupEdit from "./CustomPopupEdit.vue";
import { useRouter } from "vue-router";
import { deleteMember, getMembers } from "src/api/http/server-member";
import DialogError from "./dialog/DialogError.vue";
import { getChatList } from "src/api/http/server-chat";
import DialogServerVerify from "./dialog/DialogServerVerify.vue";
import { getMultiNames } from "src/api/http/account";
import DialogManageServer from "./dialog/DialogManageServer.vue";
import DialogManageChat from "./dialog/DialogManageChat.vue";

const dialogErrorTitle = ref("")
const dialogErrorContent = ref("")
const dialogErrorShown = ref(false)
const dialogErrorCallback = ref(()=>{})
/**
 *
 * @param {string} title - title
 * @param {string} content - content
 */
function showDialogError(title, content) {
  dialogErrorTitle.value = title
  dialogErrorContent.value = content
  dialogErrorShown.value = true
}
function showDialogErrorWithCallback(title, content, callback) {
  dialogErrorTitle.value = title
  dialogErrorContent.value = content
  dialogErrorShown.value = true
  dialogErrorCallback.value = callback
}

const { t } = useI18n();
const chatStr = t("app.server.chat")
const chatManageStr = t("app.server.chatManage")
const serverInfoStr = t("app.server.serverInfo")
const membersStr = t("app.server.members")
const adminsStr = t("app.server.admins")
const normalMembersStr = t("app.server.normalMembers")

const serverIdStr = t("app.server.serverId")
const serverNameStr = t("app.server.serverName")
const ownerStr = t("app.server.owner")
const descriptionStr = t("app.server.description")
const modifyStr = t("app.server.modify")

const leaveServerStr = t("app.server.leaveServer")
const deleteServerStr = t("app.server.deleteServer")
const doYouReallyWantToDeleteServerStr = t("app.server.doYouReallyWantToDeleteServer")
const doYouReallyWantToLeaveServerStr = t("app.server.doYouReallyWantToLeaveServer")
const doYouReallyWantToDeleteAdminStr = t("app.server.doYouReallyWantToDeleteAdmin")

const cancelStr = t("cancel")
const YesStr = t("yes")
const errorStr = t("error")
const successStr = t("success")
const deleteStr = t("app.server.delete")
const deleteMemberStr = t("app.server.deleteMember")

const doYouReallyWantToAddAdminStr = t("app.server.doYouReallyWantToAddAdmin")
const doYouReallyWantToDeleteMemberStr = t("app.server.doYouReallyWantToDeleteMember")

const manageVerificationStr = t("app.server.verification.manageVerification")
const addAdminStr = t("app.server.admin.addAdmin")
const deleteAdminStr = t("app.server.admin.deleteAdmin")

const chatExpand = ref(false)
const gettingChatList = ref(false)
const serverInfoExpand = ref(false)
const gettingServerInfo = ref(false)
const memberExpand = ref(false)
const gettingAdmin = ref(false)
const normalMemberExpand = ref(false)

/**
 * @type {import('vue').Ref<Map<string, String>>}
 */
const adminMap = ref(new Map())
/**
 * @type {import('vue').Ref<bigInt[]>}
 */
const adminIdList = computed(() => Array.from(adminMap.value.keys()).flatMap(val => BigInt(val)))

const userIsAdmin = computed(() =>{
  // console.log(adminIdList.value)
  return adminIdList.value.includes(props.uid)
})

// const sid = computed(() => BigInt(props.serverId))

const showDialogManageChat = ref(false)

/**
 * @param {number} cid - chat ID
 * @param {string} name - chat name
 */
function updateChatList(cid, name) {
  if (name.length) {
    chatMap.value.set(cid, name)
  } else {
    chatMap.value.delete(cid)
  }
}

function tryGetChatMap(serverId) {
  gettingChatList.value = true
  // //
  // chatMap.value = new Map([
  //   [0, "chat0"],
  //   [1, "chat1"]
  // ])
  // gettingChatList.value = false
  // return
  // //
  getChatList(serverId)
  .then(body => {
    body.chatNameList.forEach(chat => {
      chatMap.value.set(chat.id, chat.name)
    })
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally(() => {
    gettingChatList.value = false
  })
}

function tryGetServerAdmins(serverId) {
  if (gettingAdmin.value) {
    return
  }
  gettingAdmin.value = true
  // //
  // adminMap.value = new Map([
  //   [0n, "0o"],
  //   [5n, "55f"],
  //   [-1n, "uname"]
  // ])
  // gettingAdmin.value = false
  // return
  // //
  getAdmins(serverId)
  .then(body => {
    adminMap.value = getMapFromObject(body.adminIdNameMap)
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally(() => {
    gettingAdmin.value = false
  })
}

// if (!adminMap.value.size) {
//   tryGetServerAdmins(props.serverId)
// }

/**
 * @type {import('vue').Ref<ServerInfoBody>}
 */
const serverInfo = ref(null)

/**
 *
 * @param {bigInt} serverId - server ID
 */
function tryGetServerInfo(serverId) {
  if (gettingServerInfo.value) {
    return
  }
  gettingServerInfo.value = true
  // //
  // serverInfo.value = new ServerInfoBody(
  //   serverId.toString(),
  //   "sname",
  //   "-1",
  //   "description default"
  // )
  // gettingServerInfo.value = false
  // return
  // //
  getServerInfo(serverId)
  .then(body => {
    serverInfo.value = body
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally(() => {
    gettingServerInfo.value = false
  })
}

const isUserOwner = computed(() => {
  // console.log(props.uid);
  const owner = BigInt(serverInfo.value?serverInfo.value.owner:"-1")
  // console.log(owner)
  return props.uid == owner
})
const showDialogLeaveServer = ref(false)
const leavingServer = ref(false)

const isAbleToLeaveServer = ref(false)
watch(() => showDialogLeaveServer.value, (newShow) => {
  if (!newShow) {
    isAbleToLeaveServer.value = false
  }
})

function tryLeaveServer() {
  // console.log("leaving")
  leavingServer.value = true
  deleteMember(props.serverId, props.uid)
  .then(body => {
    showDialogErrorWithCallback(successStr, "", () => {
      showDialogLeaveServer.value = false
      location.reload()
    })
  })
  .catch(err => {
    console.log(err)
    showDialogErrorWithCallback(errorStr, err.message, () => {
      showDialogLeaveServer.value = false
    })
  })
  .finally(() => {
    leavingServer.value = false
  })
}

function tryDeleteServer() {
  leavingServer.value = true
  deleteServer(props.serverId)
  .then(body => {
    showDialogErrorWithCallback(successStr, "", () => {
      showDialogLeaveServer.value = false
      location.reload()
    })
  })
  .catch(err => {
    console.log(err)
    showDialogErrorWithCallback(errorStr, err.message, () => {
      showDialogLeaveServer.value = false
    })
  })
  .finally(() => {
    leavingServer.value = false
  })
}

const showDialogManageServer = ref(false)
function updateServerNameAndDescription(name, description) {
  serverInfo.value.name = name
  serverInfo.value.description = description
}

const showServerVerify = ref(false)

function verifyAddMember(uid) {
  if (memberIdList.value.length) {
    memberIdList.value.push(uid)
  }
}

const showDialogAddAdmin = ref(false)
const showDialogSecondaryAddAdmin = ref(false)
function confirmAddAdmin(uid) {
  selectAdmin.value = uid
  showDialogSecondaryAddAdmin.value = true
}
function closeConfirmAddAdmin() {
  selectAdmin.value = null
  showDialogSecondaryAddAdmin.value = false
}

const selectAdmin = ref(null)
const addingAdmin = ref(false)

function tryAddAdmin() {
  if (addingAdmin.value) {
    return
  }
  addingAdmin.value = true
  addAdmin(props.serverId, selectAdmin.value)
  .then(body => {
    showDialogErrorWithCallback(successStr, `${addAdminStr} ${selectAdmin.value}`, () => {
      closeConfirmAddAdmin()
      location.reload()
    })
  })
  .catch(err => {
    console.log(err)
    showDialogErrorWithCallback(errorStr, err.message, () => {
      closeConfirmAddAdmin()
    })
  })
  .finally(() => {
    addingAdmin.value = false
  })
}

const deletableAdmin = computed(() => {
  // console.log(isUserOwner.value)
  if (isUserOwner.value) {
    return adminIdList.value.filter(val => val != props.uid)
  }
  return adminIdList.value.filter(val => val == props.uid)
})
const showDialogDeleteAdmin = ref(false)
const showDialogSecondaryDeleteAdmin = ref(false)
const selectDeleteAdmin = ref(null)
function confirmDeleteAdmin(uid) {
  selectDeleteAdmin.value = uid
  showDialogSecondaryDeleteAdmin.value = true
}
function closeConfirmDeleteAdmin() {
  selectDeleteAdmin.value = null
  showDialogSecondaryDeleteAdmin.value = false
}
const deletingAdmin = ref(false)

function tryDeleteAdmin() {
  if (deletingAdmin.value) {
    return
  }
  deletingAdmin.value = true
  deleteAdmin(props.serverId, selectDeleteAdmin.value)
  .then(body => {
    showDialogErrorWithCallback(successStr, `${deleteAdminStr} ${selectDeleteAdmin.value}`, () => {
      closeConfirmDeleteAdmin()
      location.reload()
    })
  })
  .catch(err => {
    console.log(err)
    showDialogErrorWithCallback(errorStr, err.message, () => {
      closeConfirmDeleteAdmin()
    })
  })
  .finally(() => {
    deletingAdmin.value = false
  })
}

function tryGetMember(serverId) {
  gettingMemberList.value = true
  // //
  // memberIdList.value = [10,11,15,20]
  // gettingMemberList.value = false
  // return
  // //
  getMembers(serverId)
  .then(body => {
    memberIdList.value = body.userIdList
      .flatMap(val => BigInt(val))
      .filter(val => adminIdList.value.indexOf(val) == -1)
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally(() => {
    gettingMemberList.value = false
  })
}

const showDialogDeleteMember = ref(false)
const showDialogSecondaryDeleteMember = ref(false)
const selectDeleteMember = ref(null)
function confirmDeleteMember(uid) {
  selectDeleteMember.value = uid
  showDialogSecondaryDeleteMember.value = true
}
function closeConfirmDeleteMember() {
  selectDeleteMember.value = null
  showDialogDeleteMember.value = false
}
const deletingMember = ref(false)

function tryDeleteMember() {
  deletingMember.value = true
  deleteMember(props.serverId, selectDeleteMember.value)
  .then(body => {
    memberIdList.value = memberIdList.value.filter(val => val != selectDeleteMember.value)
    showDialogErrorWithCallback(successStr, `${selectDeleteMember.value} ${deleteStr}`, () => {
      closeConfirmDeleteMember()
    })
  })
  .catch(err => {
    console.log(err)
    showDialogErrorWithCallback(errorStr, err.message, () => {
      closeConfirmDeleteMember()
    })
  })
  .finally(() => {
    deletingMember.value = false
  })
}

/**
 * @type {import('vue').Ref<Map<string, string>>}
 */
const normalNameMap = ref(new Map())

function tryGetNamesFromId() {
  // //
  // normalNameMap.value.set("10", "aaa")
  // return
  // //
  getMultiNames(getSetFromArray(memberIdList.value))
  .then(body => {
    normalNameMap.value = getMapFromObject(body.nameMap)
  })
  .catch(err => {
    console.log(err)
    //
  })
  .finally(() => {
    //
  })
}

/**
 * @type {import('vue').Ref<Map<number, string>>}
 */
const chatMap = ref(new Map())
const chatIdList = computed(() => Array.from(chatMap.value.keys()))
/**
 * @type {import('vue').Ref<bigInt[]>}
 */
const memberIdList = ref([])
const gettingMemberList = ref(false)

watch(() => props.serverId, (newSid) => {
  chatExpand.value = false
  serverInfoExpand.value = false
  serverInfo.value = null
  chatMap.value = new Map()
  memberIdList.value = []
  normalNameMap.value = new Map()
  if (newSid || newSid === BigInt(0)) {
    tryGetServerAdmins(newSid)
    tryGetServerInfo(props.serverId)
  }
  //if chat list not cached, close
  //if server info not cached, close
})

watch(chatExpand, (newCe) => {
  if (newCe) {
    //get chat list
    if (!chatMap.value.size) {
      tryGetChatMap(props.serverId)
    }
  }
})
watch(serverInfoExpand, (newSie) => {
  if (newSie) {
    //get server info
    if (!serverInfo.value) {
      tryGetServerInfo(props.serverId)
    }
  }
})
watch(() => (normalMemberExpand.value || showDialogAddAdmin.value), (newNme) => {
  if (newNme) {
    if (!memberIdList.value.length) {
      tryGetMember(props.serverId)
    }
  }
})
watch(() => (showDialogDeleteMember.value || showDialogAddAdmin.value), (newShow) => {
  if (newShow) {
    if (!normalNameMap.value.size) {
      tryGetNamesFromId()
    }
  }
})

const router = useRouter()
/**
 *
 * @param {bigInt} cid - server ID
 */
function routeTo(cid) {
  router.push({ name: "app",
    params: {
      serverId: props.serverId.toString(),
      chatId: cid.toString()
    }
  })
}

</script>
