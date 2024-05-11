<template>
  <DialogError
    v-model="dialogErrorShown"
    :title="dialogErrorTitle"
    :content="dialogErrorContent"
    :onHide="dialogErrorCallback"
  />
  <q-dialog
    v-model="model"
  >
    <q-card>
      <q-card-section v-show="showCreateServer">
        <div class="row">
          <q-space />
          <q-btn
            @click="showDialogCreateServer = true"
          >{{ createServerStr }}</q-btn>
          <q-dialog
            persistent
            v-model="showDialogCreateServer"
          >
            <q-card>
              <q-bar>
                <q-space />
                <q-btn
                  flat
                  icon="close"
                  :disable="creatingServer"
                  v-close-popup
                />
              </q-bar>
              <q-card-section>
                <div class="column">
                  <q-input
                    ref="serverNameInputRef"
                    v-model="serverName"
                    :label="serverNameStr"
                    :rules="serverNameRules"
                  ></q-input>
                  <q-input
                    ref="serverDescriptionInputRef"
                    v-model="serverDescription"
                    :label="descriptionStr"
                    :rules="descriptionRules"
                  ></q-input>
                  <q-separator spaced />
                  <div class="row">
                    <q-space />
                    <q-btn
                      @click="tryCreateServer"
                    >{{ createStr }}</q-btn>
                  </div>
                  <q-inner-loading :showing="creatingServer"/>
                </div>
              </q-card-section>
            </q-card>
          </q-dialog>
          <q-separator />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="column">
          <q-input
            ref="serverIdInputRef"
            v-model="serverId"
            :label="serverIdStr"
            :rules="serverIdRules"
          >
            <template v-slot:append>
              <q-btn
                flat
                color="black"
                @click="tryGetServerInfo"
              >{{ searchStr }}</q-btn>
              <q-inner-loading :showing="serverInfoLoading" />
            </template>
          </q-input>
          <div class="column" v-show="serverInfoToShow">
            <q-separator spaced/>
            <div class="row" v-show="showServerAddBtn">
              <q-space />
              <q-btn
                @click="showDialogJoinServer = true"
              >
                {{ joinServerStr }}
                <q-dialog
                  persistent
                  v-model="showDialogJoinServer"
                >
                  <q-card>
                    <q-bar>
                      <q-btn
                        flat
                        @click="joinCode = 0"
                        :color="joinCode == 0?'blue':''"
                      >{{ passwordStr }}</q-btn>
                      <q-btn
                        flat
                        @click="joinCode = 1"
                        :color="joinCode == 1?'blue':''"
                      >{{ messageStr }}</q-btn>
                      <q-space />
                      <q-separator vertical />
                      <q-btn
                        flat
                        icon="close"
                        :disable="joiningServer"
                        v-close-popup
                      />
                    </q-bar>
                    <q-card-section>
                      {{ joinModeTitle }}:
                      <q-input
                        ref="msgInputRef"
                        v-model="msg"
                        :rules="vMessageRules"
                      >
                        <template v-slot:append>
                          <q-btn
                            flat
                            color="black"
                            @click="tryJoinServer"
                          >{{ sendStr }}</q-btn>
                        </template>
                      </q-input>
                      <q-inner-loading :showing="joiningServer" />
                    </q-card-section>
                  </q-card>
                </q-dialog>
              </q-btn>
              <q-inner-loading :showing="serverInfoLoading" />
            </div>
            <div>{{ serverIdStr }}: {{ serverInfoToShow?serverInfoToShow.serverId:"" }}</div>
            <div>{{ serverNameStr }}: {{ serverInfoToShow?serverInfoToShow.name:"" }}</div>
            <div>{{ ownerStr }}: {{ serverInfoToShow?serverInfoToShow.owner:"" }}</div>
            <div>{{ descriptionStr }}: {{ serverInfoToShow?serverInfoToShow.description:"" }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { createServer, getServerInfo } from 'src/api/http/server';
import store from "src/stores/index";
import { useChatStore } from "src/stores/chat-store";
import DialogError from './DialogError.vue';
import { ref } from 'vue';
import { useI18n } from "vue-i18n";
import { requestJoinServer } from 'src/api/http/server-member';
import { makeUserNameRules, makeServerIdRules, makeVerificationMessageRules, makeDescrptionRules } from 'src/api/rules';
import { computed } from 'vue';
import { ServerInfoBody } from 'src/api/dto/response/response-server';

const { t } = useI18n();
const createServerStr = t("app.server.createServer")
const createStr = t("app.server.create")
const searchStr = t("app.server.search")
const joinServerStr = t("app.server.joinServer")
const joinStr = t("app.server.join")
const errorStr = t("error")
const successStr = t("success")
const serverIdStr = t("app.server.serverId")
const serverNameStr = t("app.server.serverName")
const ownerStr = t("app.server.owner")
const descriptionStr = t("app.server.description")
const passwordStr = t("app.server.password")
const messageStr = t("app.server.message")
const joinServerPasswordStr = t("app.server.joinServerPassword")
const verificationMessageStr = t("app.server.verificationMessage")
const sendStr = t("app.server.send")

const nameEmptyErrorStr = t("app.server.error.nameEmptyError")
const nameTooLongError = t("app.server.error.nameTooLongError")
const serverNameRules = makeUserNameRules(nameEmptyErrorStr, nameTooLongError)

const descriptionEmptyErrorStr = t("app.server.error.descriptionEmptyError")
const descriptionTooLongErrorStr = t("app.server.error.descriptionTooLongError")
const descriptionRules = makeDescrptionRules(descriptionEmptyErrorStr, descriptionTooLongErrorStr)

const serverIdEmptyErrorStr = t("app.server.error.serverIdEmptyError")
const serverIdTooLongErrorStr = t("app.server.error.serverIdTooLongError")
const serverIdNotNumberErrorStr = t("app.server.error.serverIdNotNumberError")
const serverIdRules = makeServerIdRules(serverIdEmptyErrorStr, serverIdTooLongErrorStr, serverIdNotNumberErrorStr)

const inputEmptyErrorStr = t("app.server.error.inputEmptyError")
const inputTooLongErrorStr = t("app.server.error.inputTooLongError")
const vMessageRules = makeVerificationMessageRules(inputEmptyErrorStr, inputTooLongErrorStr)

const serverId = ref("")
const serverIdInputRef = ref(null)

const chatStore = useChatStore()

const model = defineModel()
const emit = defineEmits(['addNewServer'])
// emit('newTextMessage', textStr)

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

/**
 *
 * @param {bigInt} sid - server ID
 * @param {string} name - server name
 */
function emitAddNewServer(sid, name) {
  chatStore.accountInfo.servers.push(sid.toString())
  emit('addNewServer', sid, name)
}

const showCreateServer = computed(() => {
  let aInfo = chatStore.accountInfo
  if (aInfo) {
    return aInfo.serverCreateTimes > 0
  }
  return false
})

const showDialogCreateServer = ref(false)
const showDialogJoinServer = ref(false)

const serverNameInputRef = ref(null)
const serverName = ref("")
const serverDescriptionInputRef = ref(null)
const serverDescription = ref("")

function isCreateServerValidated() {
  return !(serverNameInputRef.value.hasError
  || serverName.value.length == 0
  || serverDescriptionInputRef.value.hasError
  || serverDescription.value.length == 0)
}

const creatingServer = ref(false)

function tryCreateServer() {
  if (!isCreateServerValidated()) {
    return
  }
  if (creatingServer.value) {
    return
  }
  creatingServer.value = true
  const name = serverName.value
  const description = serverDescription.value
  createServer(name, description)
  .then(body => {
    chatStore.accountInfo.serverCreateTimes -= 1
    emitAddNewServer(BigInt(body.serverId), body.name)
    showDialogError(successStr, `${body.name} ${serverIdStr}: ${body.serverId}`)
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally(() => {
    creatingServer.value = false
  })
}

/**
 * @type {import('vue').Ref<ServerInfoBody>}
 */
const serverInfoToShow = ref(null)
const showServerAddBtn = computed(() => {
  if (!serverInfoToShow.value) {
    return true
  }
  let aInfo = chatStore.accountInfo
  if (aInfo) {
    return aInfo.servers.indexOf(serverInfoToShow.value.serverId.toString()) == -1
  }
  return true
})
const serverInfoLoading = ref(false)

function tryGetServerInfo() {
  if (serverIdInputRef.value.hasError || serverId.value.length == 0) {
    return
  }
  if (serverInfoLoading.value) {
    return
  }
  serverInfoLoading.value = true
  getServerInfo(serverId.value)
  .then(body => {
    serverInfoToShow.value = body
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally(() => {
    serverInfoLoading.value = false
  })
}

const joinCode = ref(0)
const joinModeTitle = computed(() => {
  switch (joinCode.value) {
    case 0:
      return joinServerPasswordStr
    case 1:
      return verificationMessageStr

    default:
      return "?"
  }
})

const msgInputRef = ref(null)
const msg = ref("")
const joiningServer = ref(false)

function tryJoinServer() {
  if (msgInputRef.value.hasError || msg.value.length == 0) {
    return
  }
  if (joiningServer.value) {
    return
  }
  joiningServer.value = true
  // //
  // setTimeout(() => joiningServer.value = false, 2000)
  // return
  // //
  const sid = BigInt(serverInfoToShow.value.serverId)
  const sname = serverInfoToShow.value.name
  const c = joinCode.value
  const m = msg.value
  // message
  requestJoinServer(sid, c, m)
  .then(body => {
    if (!c) {
      emitAddNewServer(sid, sname)
    }
    showDialogErrorWithCallback(successStr, "", () => {
      showDialogJoinServer.value = false
    })
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally(() => {
    joiningServer.value = false
  })
}
</script>
