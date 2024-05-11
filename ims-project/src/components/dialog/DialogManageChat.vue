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
      <q-card-actions>
        <div>{{ chatStr }}</div>
        <q-space />
        <q-btn
          @click="showDialogCreateChat = true"
        >
          {{ createStr }}
          <q-dialog
            v-model="showDialogCreateChat"
            :persistent="creatingChat"
          >
            <q-card>
              <q-card-section>
                <q-input
                  ref="chatNameInputRef"
                  v-model="chatName"
                  :rules="chatNameRules"
                >
                  <template v-slot:append>
                    <q-btn
                      flat
                      color="black"
                      @click="tryAddChat"
                    >{{ createStr }}</q-btn>
                  </template>
                </q-input>
              </q-card-section>
              <q-inner-loading :showing="creatingChat" />
            </q-card>
          </q-dialog>
        </q-btn>
      </q-card-actions>
      <q-card-section>
        <q-list bordered separator>
          <q-item
            v-for="chatId in chatIdList"
            :key="chatId"
          >
            <div class="row no-warp flex-center">
              <div>{{ chatMap.get(chatId) }}</div>
              <q-space />
              <q-btn
                flat
                @click="setModifyChat(chatId)"
                :disable="modifyingChat"
              >
                {{ modifyStr }}
                <q-dialog
                  v-model="showDialogModifyChat"
                  :persistent="modifyingChat"
                >
                  <q-card>
                    <q-card-actions>
                      <q-btn
                        flat
                        color="red"
                        @click="showDialogDeleteChat = true"
                      >
                        {{ deleteStr }}
                        <q-dialog
                          v-model="showDialogDeleteChat"
                        >
                          <q-card>
                            <q-card-section>
                              {{ doYouReallyWantToDeleteChatStr }}
                            </q-card-section>
                            <q-card-actions>
                              <q-btn
                                color="red"
                                :disable="modifyingChat"
                                @click="tryDeleteChat"
                              >
                                {{ yesStr }}
                              </q-btn>
                              <q-space />
                              <q-btn
                                v-close-popup
                                :disable="modifyingChat"
                              >
                                {{ cancelStr }}
                              </q-btn>
                            </q-card-actions>
                            <q-inner-loading :showing="modifyingChat" />
                          </q-card>
                        </q-dialog>
                      </q-btn>
                    </q-card-actions>
                    <q-card-section>
                      <q-input
                        ref="modifiedChatNameInputRef"
                        v-model="modifiedChatName"
                        :rules="chatNameRules"
                      >
                        <template v-slot:append>
                          <q-btn
                            flat
                            color="black"
                            @click="tryModifyChat"
                          >{{ modifyStr }}</q-btn>
                        </template>
                      </q-input>
                    </q-card-section>
                    <q-inner-loading :showing="modifyingChat" />
                  </q-card>
                </q-dialog>
              </q-btn>
            </div>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from 'vue';
import DialogError from './DialogError.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { createChat, deleteChat, modifyChatInfo } from 'src/api/http/server-chat';
import { makeUserNameRules } from 'src/api/rules';
import { watch } from 'vue';

const { t } = useI18n()

const chatStr = t("app.server.chat")
const createStr = t("app.server.chatStrings.create")
const modifyStr = t("app.server.modify")
const errorStr = t("error")
const successStr = t("success")
const deleteStr = t("app.server.delete")
const yesStr = t("yes")
const cancelStr = t("cancel")

const doYouReallyWantToDeleteChatStr = t("app.server.chatStrings.doYouReallyWantToDeleteChat")

const model = defineModel()
const props = defineProps({
  chatMap: {
    type: Map,
    required: true
  },
  serverId: {
    type: BigInt,
    required: true
  }
})

const emit = defineEmits(['updateChatList'])

const chatIdList = computed(() => Array.from(props.chatMap.keys()))

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

const nameEmptyErrorStr = t("app.server.error.nameEmptyError")
const nameTooLongError = t("app.server.error.nameTooLongError")
const chatNameRules = makeUserNameRules(nameEmptyErrorStr, nameTooLongError)

const showDialogCreateChat = ref(false)
const chatNameInputRef = ref(null)
const chatName = ref("")

const creatingChat = ref(false)

function tryAddChat() {
  if (creatingChat.value) {
    return
  }
  if (chatNameInputRef.value.hasError || !chatName.value.length) {
    return
  }
  creatingChat.value = true
  // setTimeout(() => creatingChat.value = false, 1000)
  createChat(chatName.value, props.serverId)
  .then(body => {
    const newChatId = body.chatId
    emit('updateChatList', newChatId, chatName.value)
    showDialogErrorWithCallback(successStr, newChatId, () => {
      showDialogCreateChat.value = false
    })
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally(() => {
    chatName.value = ""
    creatingChat.value = false
  })
}

const showDialogModifyChat = ref(false)
const modifyingChat = ref(false)
const selectChat = ref(null)
const modifiedChatNameInputRef = ref(null)
const modifiedChatName = ref("")

function setModifyChat(cid) {
  selectChat.value = cid
  modifiedChatName.value = props.chatMap.get(cid)
  showDialogModifyChat.value = true
}
// function closeSetModifyChat() {
//   selectChat.value = null
//   showDialogModifyChat.value = false
// }
watch(() => showDialogModifyChat.value, (newShow) => {
  if (!newShow) {
    selectChat.value = null
    modifiedChatName.value = ""
  }
})

function tryModifyChat() {
  if (modifyingChat.value) {
    return
  }
  if (modifiedChatNameInputRef.value.hasError || !modifiedChatName.value.length) {
    return
  }
  if (modifiedChatName.value === props.chatMap.get(selectChat.value)) {
    showDialogModifyChat.value = false
    return
  }
  modifyChatInfo(props.serverId, selectChat.value, modifiedChatName.value)
  .then(body => {
    emit('updateChatList', selectChat.value, body.chatName)
    showDialogErrorWithCallback(successStr, body.chatName, () => {
      showDialogModifyChat.value = false
    })
  })
  .catch(err => {
    console.log(err)
    showDialogErrorWithCallback(errorStr, err.message, () => {
      showDialogModifyChat.value = false
    })
  })
  .finally(() => {
    modifyingChat.value = false
  })
}

const showDialogDeleteChat = ref(false)

function tryDeleteChat() {
  if (modifyingChat.value) {
    return
  }
  modifyingChat.value = true
  deleteChat(props.serverId, selectChat.value)
  .then(body => {
    emit('updateChatList', selectChat.value, "")
    showDialogErrorWithCallback(successStr, "", () => {
      showDialogDeleteChat.value = false
      showDialogModifyChat.value = false
    })
  })
  .catch(err => {
    console.log(err)
    showDialogErrorWithCallback(errorStr, err.message, () => {
      showDialogDeleteChat.value = false
      showDialogModifyChat.value = false
    })
  })
  .finally(() => {
    modifyingChat.value = false
  })
}

</script>
