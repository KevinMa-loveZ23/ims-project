<template>
  <q-layout view="hHh LpR lFr">
    <DialogError v-model="showDialog" :title="dialogTitle" :content="dialogContent" />
    <DialogConnecting
      v-model="connecting"
    />
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar> -->
          {{ titleStr }}
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <FunctionMenu :uid="uid" />
    </q-drawer>

    <q-drawer show-if-above v-show="showRightDrawer" v-model="rightDrawerOpen" side="right" bordered>
      <ServerMenu
        :serverId="serverId"
        :uid="uid"
        v-show="showRightDrawer"
      />
      <!-- v-show="showRightDrawer" -->
    </q-drawer>

    <q-page-container
      style="width: auto; height: auto"
    >
      <!-- <router-view /> -->
      <q-page
        class="column flex-center"
      >
        <q-resize-observer @resize="containerResize" />
        <q-scroll-area
          :style="scrollSize"
          ref="scrollAreaRef"
          @scroll="onScroll"
        >
          <!-- style="min-width: inherit; min-height: inherit;" -->
          <MessageContent
            :serverId="serverId"
            :chatId="chatId"
            :uid="uid"
            :msgList="messageList"
            v-show="showMiddle"
            @add-history-message="addHistoryMessage"
            style="padding: 0 2%; min-width: inherit; min-height: inherit;"
          >
            <!-- <q-resize-observer @resize="messageResize" /> -->
          </MessageContent>
        </q-scroll-area>
      </q-page>
      <!-- :serverId="serverId"
        :chatId="chatId" -->
    </q-page-container>

    <q-footer bordered class="bg-grey-8 text-white" v-show="showMiddle">
      <q-toolbar>
        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar> -->
          <div class="row no-warp">
            <div class="col-auto">
              <!-- Title -->
            </div>
            <div class="col row">
              <div class="col"></div>
              <div class="col-auto">
                <q-btn
                  @click="textInputShown = !textInputShown"
                >
                  {{ textInputShown?uploadImageStr:inputTextStr }}
                </q-btn>
              </div>
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
      <q-separator />
      <FooterInput
        :text-input-shown="textInputShown"
        @new-text-message="textMessage"
        @new-image-message="imageMessage"
      />
    </q-footer>

  </q-layout>
</template>

<script setup>
import FooterInput from 'src/components/FooterInput.vue'
import FunctionMenu from 'src/components/FunctionMenu.vue'
import ServerMenu from 'src/components/ServerMenu.vue'
import MessageContent from 'src/components/MessageContent.vue';
import DialogConnecting from 'src/components/dialog/DialogConnecting.vue';
import { watch } from 'vue';
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import { useI18n } from "vue-i18n";
import { connectChatServer } from 'src/api/ws/websocket'
import store from "src/stores/index";
import { useAuthStore } from "src/stores/user-id-store";
import { useChatStore } from "src/stores/chat-store"
import { getHistoryMessage, uploadImageMessage } from 'src/api/http/server-chat';
import DialogError from 'src/components/dialog/DialogError.vue';
import { SimpleChatMessage } from 'src/api/dto/message/simple-message';
import { TYPE_IMAGE } from 'src/api/dto/message/message-const';
import { MessageShown } from 'src/api/entity/message';
import { getTmpId } from 'src/api/dto/message/message-const'
import { TYPE_TEXT } from 'src/api/dto/message/message-const';
import { computed } from 'vue';
import { MessagingHandler } from 'src/api/ws/message';
import { ClientMessage } from 'src/api/dto/message/client-message';

const scrollAreaRef = ref(null)
/**
 * @type {import('vue').Ref<{width:number,height:number} | null>}
 */
const scrollRealSize = ref({
  width: 0,
  height: 0
})
const scrollSize = ref({
  width: '0px',
  height: '0px'
})
// const scrollAreaStyle = computed(() => containerSize.value.height, (newHeight) => {
//   if (newHeight) {
//     return `width: inherit; height: ${newHeight};`
//   }
//   return `width: inherit; height: inherit;`
// })
function containerResize(size) {
  const styleSize = size
  scrollRealSize.value = size
  if (styleSize) {
    // styleSize.width += 'px'
    // styleSize.height += 'px'
    const w = Math.floor(scrollRealSize.value.width * 0.99)
    const h = Math.floor(scrollRealSize.value.height * 0.95)
    scrollRealSize.value.width = w
    scrollRealSize.value.height = h
    styleSize.width = w + 'px'
    styleSize.height = h + 'px'
  }
  scrollSize.value = styleSize
  // console.log(containerSize.value)
}

// const messageSize = ref({
//   width: 0,
//   height: 0
// })
// function messageResize(size) {
//   console.log(size)
//   messageSize.value = size
// }

// const verticalPos = ref(0)
const verticalPer = ref(0)
const verticalSiz = ref(0)
// function onScroll({ verticalPosition }) {
//   console.log(verticalPosition)
//   verticalPos.value = verticalPosition
// }
function onScroll({
  // verticalPosition,
  verticalPercentage,
  verticalSize
}) {
  // console.log(verticalPercentage)
  // console.log(verticalPosition)
  // console.log(verticalSize)
  // verticalPos.value = verticalPosition
  verticalPer.value = verticalPercentage
  verticalSiz.value = verticalSize
}

/**
 *
 * @param {number} pos - position
 */
function scroll(pos) {
  scrollAreaRef.value.setScrollPosition('vertical', pos, 100)
}

// watch(() => messageSize.value.height, (newH, oldH) => {
//   console.log(oldH)
//   // console.log(verticalPos.value)
//   console.log(newH)
//   console.log("111")
//   if (verticalPos.value >= oldH) {
//     scroll(newH)
//   }
// }, { immediate: true })

const scrollLeft = computed(() => {
  return verticalSiz.value - (verticalPer.value * verticalSiz.value)
  }
)
watch([() => scrollLeft.value, () => verticalSiz.value],
  ([newLeft, newSiz], [oldLeft, oldSiz]) => {
    // console.log(`${newSiz}-${oldSiz};${oldLeft}`)
    if (oldLeft < 10 && newSiz > oldSiz) {
      // console.log("dash")
      scroll(newSiz)
    }
  }, { immediate: true }
)

// watch(() => {
//   return verticalSiz.value - (verticalPer.value * verticalSiz.value)
//   }, (newLeft) => {
//     // console.log(oldH)
//     // console.log(verticalPos.value)
//     // console.log(newH)
//     // if (verticalPos.value >= oldH) {
//     //   scroll(newH)
//     // }
//     console.log(newLeft)
//     if (scrollAreaRef.value && newLeft < 10) {
//       scroll(verticalSiz.value)
//     }
//   }, { immediate: true }
// )
// watch(() => verticalSiz.value, (newSiz, oldSiz) => {
//   if (newSiz > oldSiz && ) {

//   }
// })

// watch((() => scrollRealSize.value, (srs) => {
//   if (srs) {
//    watch(() => scrollRealSize.value.height, (newH, oldH) => {
//       console.log(oldH)
//       if (oldH == verticalPos.value) {
//         scroll(newH)
//       }
//     }, { immediate: true })
//   }
// }), { immediate: true })

const { t } = useI18n();

const titleStr = t("app.title")

const uploadImageStr = t("app.input.uploadImage")
const inputTextStr = t("app.input.inputText")

const errorStr = t("error")

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

const textInputShown = ref(true)

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const route = useRoute()
const serverId = ref(
  route.params.serverId
  ?BigInt(route.params.serverId)
  :null
)
const chatId = ref(
  route.params.chatId
  ?parseInt(route.params.chatId)
  :null
)
watch(() => route.params.serverId, (newId, oldId) => {
  serverId.value = newId?BigInt(newId):null
})
watch(() => route.params.chatId, (newId, oldId) => {
  chatId.value = newId?parseInt(newId):null
})

const showMiddle = computed(() => {
  if ((serverId.value || serverId.value === BigInt(0)) && (chatId.value || chatId.value === 0)) {
    return true
  }
  return false
})

const showRightDrawer = computed(() => {
  if (serverId.value || serverId.value === BigInt(0)) {
    return true
  }
  return false
})

// console.log(showRightDrawer.value)

// console.log(showMiddle.value)

const showDialog = ref(false)
const dialogTitle = ref("")
const dialogContent = ref("")

/**
 *
 * @param {string} title - title
 * @param {string} content - content
 */
 function popDialog(title, content) {
  dialogTitle.value = title
  dialogContent.value = content
  showDialog.value = true
}

const authStore = useAuthStore()
const chatStore = useChatStore()
// const uid =
const uid = computed(() => (authStore.isIdEmpty ? BigInt(-1) : authStore.uid))
const token = computed(() => (authStore.isTokenEmpty ? "" : authStore.token))

/**
 *
 * @param {bigInt} a
 * @param {bigInt} b
 * @returns {number}
 */
function compBigInt(a, b) {
  return a > b ? 1 : (a < b ? -1 : 0)
}

/**
 *
 * @param {bigInt} sid - server ID
 * @param {number} cid - chat ID
 * @returns {MessageShown[]}
 */
function updateMessageList(sid, cid) {
  // console.log(`sid:${sid};cid:${cid}`)
  // //
  // const t = new MessageShown(342939657535489n, -1n,"ccc",0,false)
  // return [t]
  // //
  if ((sid || sid === BigInt(0)) && (cid || cid === 0)) {
    const tmp = chatStore.getChatMessageList(sid, cid)
    // console.log(tmp)
    return (tmp?tmp:[])
      .sort((a,b)=>{return compBigInt(a.id, b.id)})
  }
  return []
    // .flatMap(it => MessageShown.fromSimpleMessage(it))
}

/**
 * @type {import("vue").Ref<MessageShown[]>}
 */
const messageList = ref(updateMessageList(serverId.value, chatId.value))


watch(() => serverId.value, (newId) => {
  messageList.value = updateMessageList(newId, chatId.value)
})
watch(() => chatId.value, (newId) => {
  messageList.value = updateMessageList(serverId.value, newId)
})

/**
 *
 * @param {MessageShown[]} hMessageList - history message list
 */
function addHistoryMessage(hMessageList) {
  // hMessageList.filter(val => chatStore(val.userId))
  hMessageList.forEach(val => {
    chatStore.addChatMessage(serverId.value, chatId.value, val)
  })
  messageList.value = updateMessageList(serverId.value, chatId.value)
}

// let ws = connectChatServer(uid, token)
// ws.addEventListener('message', ev => {
//   ev.data
// })
// ws.addEventListener('close', ev => {
//   // ev
// })



/**
 * @type {import('vue').Ref<MessagingHandler>}
 */
const handler = ref(null)

function getHandler() {
  handler.value = new MessagingHandler(
    uid.value, token.value,
    (rmsg) => {
      const sid = BigInt(rmsg.serverId)
      const cid = rmsg.chatId
      const lid = rmsg.localId
      const mid = BigInt(rmsg.messageId)
      // console.log(lid)
      const text = chatStore.getChatMessageByLocalId(sid, cid, lid).content
      chatStore.updateChatMessage(sid, cid, lid, new MessageShown(
        mid,
        uid.value,
        text,
        TYPE_TEXT,
        false
      ))
      messageList.value = updateMessageList(serverId.value, chatId.value)
      // console.log(messageList.value)
    },
    (fmsg) => {
      // console.log("forward message")
      const sid = BigInt(fmsg.serverId)
      const cid = fmsg.chatId
      const userid = BigInt(fmsg.userId)
      const mid = BigInt(fmsg.id)
      const text = fmsg.content
      const type = fmsg.type
      chatStore.addChatMessage(sid, cid, new MessageShown(
        mid,
        userid,
        text,
        type,
        false
      ))
      messageList.value = updateMessageList(serverId.value, chatId.value)
    },
    (oev) => {
      connecting.value = false
    },
    (eev) => {
      // connectWs()
      // popDialog(errorStr, `${eev.type} (${eev.timeStamp})`)
    },
    (cev) => {
      connectWs()
    }
  )
}

// const mh = new MessagingHandler(
//   uid.value, token.value,
//   (rmsg) => {
//     const sid = BigInt(rmsg.serverId)
//     const cid = rmsg.chatId
//     const lid = rmsg.localId
//     const mid = BigInt(rmsg.messageId)
//     const text = chatStore.getChatMessageByLocalId(sid, cid, lid).content
//     chatStore.updateChatMessage(sid, cid, lid, new MessageShown(
//       mid,
//       uid.value,
//       text,
//       TYPE_TEXT,
//       false
//     ))
//     messageList.value = updateMessageList(serverId.value, chatId.value)
//   },
//   (fmsg) => {
//     const sid = BigInt(fmsg.serverId)
//     const cid = fmsg.chatId
//     const mid = BigInt(fmsg.id)
//     const text = fmsg.content
//     chatStore.addChatMessage(sid, cid, new MessageShown(
//       mid,
//       uid.value,
//       text,
//       TYPE_TEXT,
//       false
//     ))
//     messageList.value = updateMessageList(serverId.value, chatId.value)
//   },
//   (oev) => {
//     connecting.value = false
//   },
//   (eev) => {
//     // connectWs()
//     showDialog(errorStr, `${eev.type} (${eev.timeStamp})`)
//   },
//   (cev) => {
//     connectWs()
//   }
// )

const connecting = ref(false)

function connectWs() {
  connecting.value = true
  // console.log("conn")
  // mh.connect()
  handler.value.connect()
}
// console.log(`${uid.value},${token.value}`)

/**
 *
 * @param {ClientMessage} cMsg - message
 */
function send(cMsg) {
  handler.value.send(cMsg)
}

watch(() => (uid.value >= BigInt(0) && token.value.length > 0), (loaded) => {
  if (loaded) {
    getHandler()
    connectWs()
  }
}, { immediate: true })

// watch(() => mh.needReconnect(), (need) => {
//   console.log(need)
//   if (need) {
//    connectWs()
//   }
// })

// if (mh.needReconnect()) {
//   connectWs()
// }

// watch(() => chatStore.messageMap, () => {
//   console.log(chatStore.messageMap)
// }, {deep: true})

/**
 *
 * @param {string} text - text to be upload
 */
function textMessage(text) {
  // console.log(text)
  const tmpId = getTmpId()
  const localId = chatStore.addChatMessage(serverId.value, chatId.value,
  new MessageShown(
    tmpId,
    uid.value,
    text,
    TYPE_TEXT,
    true
  ))
  messageList.value = updateMessageList(serverId.value, chatId.value)
  // console.log(messageList.value)
  // console.log("before send")
  // mh.send(new ClientMessage(serverId.value, chatId.value, tmpId, text, TYPE_TEXT))
  send(new ClientMessage(serverId.value, chatId.value, localId, text, TYPE_TEXT))
  // uploadImageMessage(file, serverId.value, chatId.value)
  // .then((body) => {
  //   chatStore.updateChatMessage(serverId.value, chatId.value, localId, new MessageShown(
  //     body.messageId,
  //     uid,
  //     body.fileName,
  //     TYPE_IMAGE,
  //     false
  //   ))
  //   messageList.value = updateMessageList(serverId.value, chatId.value)
  // })
  // .catch((err) => {
  //   chatStore.updateChatMessage(serverId.value, chatId.value, localId, null)
  //   popDialog(errorStr, err.message)
  //   console.log("illegal")
  // })
}
/**
 *
 * @param {File} file - file to be uploaded
 */
function imageMessage(file) {
  // console.log(`${file.name} is ${file.size} by ${file.type}`)
  // url
  const url = URL.createObjectURL(file)
  const tmpId = getTmpId()
  // console.log(tmpId)
  const localId = chatStore.addChatMessage(serverId.value, chatId.value,
  new MessageShown(
    tmpId,
    uid.value,
    url,
    TYPE_IMAGE,
    true
  ))
  messageList.value = updateMessageList(serverId.value, chatId.value)
  uploadImageMessage(file, serverId.value, chatId.value)
  .then((body) => {
    // chatStore.updateChatMessage(serverId.value, chatId.value, localId, new MessageShown(
    //   BigInt(body.messageId),
    //   uid.value,
    //   body.fileName,
    //   TYPE_IMAGE,
    //   false
    // ))
    chatStore.updateChatMessage(serverId.value, chatId.value, localId, null)
    messageList.value = updateMessageList(serverId.value, chatId.value)
  })
  .catch((err) => {
    console.log(err)
    chatStore.updateChatMessage(serverId.value, chatId.value, localId, null)
    popDialog(errorStr, err.message)
    console.log("illegal")
  })
}

</script>
