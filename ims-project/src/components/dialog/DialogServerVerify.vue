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
      <q-card-section>
        <div class="row no-ward" style="width: 100%;">
          <q-space />
          <q-btn
            @click="showDialogPassword = true"
          >
            {{ managePasswordStr }}
            <q-dialog
              v-model="showDialogPassword"
              persistent
            >
              <q-card>
                <q-bar>
                  <q-space />
                  <q-btn
                    flat
                    icon="close"
                    v-close-popup
                    :disable="processingPassword"
                  />
                </q-bar>
                <q-card-actions style="width: 100%;">
                  <q-space />
                  <q-btn
                    @click="showAddPassword = true"
                  >
                    {{ addStr }}
                    <q-dialog
                      v-model="showAddPassword"
                      persistent
                    >
                      <q-card>
                        <q-bar>
                          <q-space/>
                          <q-btn
                            flat
                            icon="close"
                            v-close-popup
                            :disable="processingPassword"
                          />
                        </q-bar>
                        <q-card-section>
                          <q-input
                            ref="eMessageInputRef"
                            v-model="eMessage"
                            :rules="eMessageRules"
                          >
                            <template v-slot:append>
                              <q-btn
                                flat
                                color="black"
                                @click="tryAddEnrtyMessage"
                              >{{ addStr }}</q-btn>
                            </template>
                          </q-input>
                          <q-inner-loading :showing="processingPassword" />
                        </q-card-section>
                      </q-card>
                    </q-dialog>
                  </q-btn>
                  <q-btn
                    @click="isAbleToDeleteEntryMessage = !isAbleToDeleteEntryMessage"
                  >
                    {{ isAbleToDeleteEntryMessage?exitModifyStr:modifyStr }}
                  </q-btn>
                </q-card-actions>
                <q-card-section>
                  <q-scroll-area style="min-width: 20vw; height: 30vh;">
                    <q-list bordered separator>
                      <q-item
                        v-for="pw in passwordList"
                        :key="pw"
                      >
                        <div class="row no-warp" style="width: 100%;">
                          <div>{{ pw }}</div>
                          <q-space />
                          <q-btn
                            :disable="processingPassword || !isAbleToDeleteEntryMessage"
                            @click="tryDeleteEntryMessage(pw)"
                          >
                            {{ deleteStr }}
                          </q-btn>
                        </div>
                      </q-item>
                    </q-list>
                  </q-scroll-area>
                  <q-inner-loading :showing="processingPassword" />
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-btn>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        {{ requestJoinServerStr }}
        <!-- <q-separator spaced /> -->
        <q-scroll-area style="min-width: 20vw; height: 30vh;">
          <q-list bordered separator>
            <q-item
              v-for="id in idList"
              :key="id"
              style="width: 100%;"
            >
              <div class="row no-warp" style="width: 100%;">
                <div class="column">
                  <div>{{ getNameFromId(id) }} ({{ id }})</div>
                  <div>{{ getMessageFromId(id) }}</div>
                </div>
                <q-space />
                <!-- <div class="col" /> -->
                <q-btn
                  flat
                  color="green"
                  @click="tryAllowJoin(id)"
                >
                  <q-icon name="done" />
                </q-btn>
                <q-inner-loading :showing="whoIsJoining == id" />
              </div>
            </q-item>
          </q-list>
        </q-scroll-area>
        <q-inner-loading :showing="gettingWaitingList" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { getMultiNames } from 'src/api/http/account';
import { addEntryMessage, allowJoinServer, deleteEntryMessage, getEntryMessageList, getWaitingList } from 'src/api/http/server-member';
import { getMapFromObject, getSetFromArray } from 'src/api/map-and-set';
import { watch } from 'vue';
import { computed } from 'vue';
import { ref, defineModel } from 'vue';
import DialogError from './DialogError.vue';
import { useI18n } from "vue-i18n";
import { makeVerificationMessageRules } from 'src/api/rules';

const { t } = useI18n()

const errorStr = t("error")
const successStr = t('success')
const addStr = t("app.server.add")
const modifyStr = t("app.server.modify")
const exitModifyStr = t("app.server.exitModify")
const deleteStr = t("app.server.delete")

const requestJoinServerStr = t("app.server.verification.requestToJoinServer")
const managePasswordStr = t("app.server.verification.managePassword")

// const model = defineModel<Boolean>({ required: true })
const [model] = defineModel()
const emit = defineEmits(['addMember'])

const props = defineProps({
  serverId: {
    type: BigInt,
    required: true
  },
})

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
 * @type {import('vue').Ref<Map<string, string>>}
 */
const idMsgMap = ref(new Map())
/**
 *
 * @param {bigInt} uid - user ID
 * @returns {string}
 */
function getMessageFromId(uid) {
  return idMsgMap.value.get(uid.toString())
}

const idList = computed(() => Array.from(idMsgMap.value.keys()).flatMap(val => BigInt(val)))

/**
 * @type {import('vue').Ref<Map<string, string>>}
 */
const idNameMap = ref(new Map())
/**
 *
 * @param {bigInt} uid - user ID
 * @returns {string}
 */
function getNameFromId(uid) {
  return idNameMap.value.get(uid.toString())
}

const gettingWaitingList = ref(false)

function tryGetWaitingList() {
  gettingWaitingList.value = true
  // //
  // idMsgMap.value.set("10", "msg")
  // idNameMap.value.set("10", "10aaa")
  // gettingWaitingList.value = false
  // return
  // //
  getWaitingList(props.serverId)
  .then(body => {
    idMsgMap.value = getMapFromObject(body.waitingList)
    if (!idMsgMap.value.size) {
      return
    }
    getMultiNames(getSetFromArray(idList.value))
    .then(nameBody => {
      idNameMap.value = getMapFromObject(nameBody.nameMap)
    })
    .catch(err => {
      console.log(err)
      showDialogError(errorStr, err.message)
    })
    .finally(() => {
      //
    })
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally(() => {
    gettingWaitingList.value = false
  })
}

const whoIsJoining = ref(BigInt(-1))

/**
 *
 * @param {bigInt} uid - user ID
 */
function tryAllowJoin(uid) {
  whoIsJoining.value = uid
  if (whoIsJoining.value === BigInt(-1)) {
    return
  }
  // //
  // emit('addMember', uid)
  // idMsgMap.value.delete(uid.toString())
  // showDialogError(successStr, `${getNameFromId(uid)} (${uid})`)
  // whoIsJoining.value = -1n
  // return
  // //
  allowJoinServer(props.serverId, uid)
  .then(body => {
    emit('addMember', uid)
    idMsgMap.value.delete(uid.toString())
    showDialogError(successStr, `${getNameFromId(uid)} (${uid})`)
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally(() => {
    whoIsJoining.value = BigInt(-1)
  })
}

const showDialogPassword = ref(false)
/**
 * @type {import('vue').Ref<String[]>}
 */
const passwordList = ref([])
const loadingPasswordList = ref(false)

function tryGetEntryMessageList() {
  loadingPasswordList.value = true
  // //
  // passwordList.value = ["aaa"]
  // console.log(passwordList.value)
  // loadingPasswordList.value = false
  // return
  // //
  getEntryMessageList(props.serverId)
  .then(body => {
    passwordList.value = body.entryMessageList
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally(() => {
    loadingPasswordList.value = false
  })
}

const processingPassword = ref(false)
const showAddPassword = ref(false)

const eMessageInputRef = ref(null)
const eMessage = ref("")
const inputEmptyErrorStr = t("app.server.error.inputEmptyError")
const inputTooLongErrorStr = t("app.server.error.inputTooLongError")
const eMessageRules = makeVerificationMessageRules(inputEmptyErrorStr, inputTooLongErrorStr)

function tryAddEnrtyMessage() {
  if (processingPassword.value) {
    return
  }
  if (eMessageInputRef.value.hasError || !eMessage.value.length) {
    return
  }
  if (passwordList.value.indexOf(eMessage.value) != -1) {
    showDialogError(errorStr, "")
    return
  }
  processingPassword.value = true
  // //
  // passwordList.value.push(eMessage.value)
  // showDialogErrorWithCallback(successStr, `"${eMessage.value}"`, () => {
  //   showAddPassword.value = false
  // })
  // processingPassword.value = false
  // return
  // //
  addEntryMessage(props.serverId, eMessage.value)
  .then(body => {
    passwordList.value.push(eMessage.value)
    showDialogErrorWithCallback(successStr, `"${eMessage.value}"`, () => {
      showAddPassword.value = false
    })
  })
  .catch(err => {
    console.log(err)
    showDialogErrorWithCallback(errorStr, err.message, () => {
      showAddPassword.value = false
    })
  })
  .finally(() => {
    eMessage.value = ""
    processingPassword.value = false
  })
}

const isAbleToDeleteEntryMessage = ref(false)

/**
 *
 * @param {string} msg - entry message to be deleted
 */
function tryDeleteEntryMessage(msg) {
  if (processingPassword.value) {
    return
  }
  processingPassword.value = true
  // //
  // passwordList.value = passwordList.value.filter(val => val != msg)
  // showDialogError(successStr, `${msg} ${deleteStr}`)
  // processingPassword.value = false
  // return
  // //
  deleteEntryMessage(props.serverId, msg)
  .then(body => {
    passwordList.value = passwordList.value.filter(val => val != msg)
    showDialogError(successStr, `${msg} ${deleteStr}`)
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally(() => {
    processingPassword.value = false
  })
}

function clear() {
  idMsgMap.value = new Map()
  idNameMap.value = new Map()
  passwordList.value = []
}

watch(() => props.serverId, (newSid) => {
  clear()
  // tryGetWaitingList()
})

watch(() => model.value, (newModel) => {
  // console.log(newModel)
  if (newModel && !idMsgMap.value.size) {
    tryGetWaitingList()
  }
  if (!newModel) {
    clear()
  }
})

watch(() => showDialogPassword.value, (newShow) => {
  if (newShow) {
    tryGetEntryMessageList()
  } else {
    passwordList.value = []
    isAbleToDeleteEntryMessage.value = false
  }
})

watch(() => showAddPassword.value, (newShow) => {
  eMessage.value = ""
})

</script>
