<template>
  <!-- {{ serverId }},{{ chatId }} -->
  <div
    style="height: 100%; width:100%;"
    class="column"
  >
    <!-- <slot></slot> -->
    <!-- <q-virtual-scroll></q-virtual-scroll> -->
      <!-- <q-scroll-area class="q-mt-sm col"
      > -->
        <!-- style="width: inherit; height: inherit;" -->
    <q-pull-to-refresh
      @refresh="getHistory"
      :disable="noMoreHistory"
      style="height: fit-content; width: 100%;"
    >
      <!-- style="height: 50vh;" -->
      <div v-if="!msgList.length" class="column flex-center">
        <div style="min-height: 2vh;"></div>
        <div>{{ noMoreHistory ? noMoreMessageStr : dragToLoadStr }}</div>
      </div>
      <DialogImage
        v-model="showDialog"
        :srcUrl="srcUrl"
        :file="imgFile"
      />
      <q-chat-message
        v-for="msg in msgList"
        :name="getNameFromId(msg.userId)"
        v-bind:key="msg.id"
        v-bind:sent="msg.userId == uid"
        :stamp="getDateFromId(msg.id).toLocaleString()"
      >
        <div>
          <div
            v-if="msg.type == TYPE_TEXT"
          >
            {{ msg.content }}
          </div>
          <!-- <div
            v-else-if="msg.type == TYPE_IMAGE"
            @click="showImageInDialog(msg)"
          >
            <q-img
              :src="getSrcFromMsg(msg)"
            />
          </div> -->
          <ImageMessage
            v-else-if="msg.type == TYPE_IMAGE"
            :msg="msg"
            :server-id="serverId"
            :chat-id="chatId"
            @showImg="showImageInDialog"
          />
          <q-inner-loading :showing="msg.loading" />
        </div>
      </q-chat-message>
    </q-pull-to-refresh>
    <!-- </q-scroll-area> -->
  </div>


</template>
<script setup>
import DialogImage from "./dialog/DialogImage.vue"
import ImageMessage from "./ImageMessage.vue"
import store from "src/stores/index";
import { useAuthStore } from "src/stores/user-id-store";
import { useChatStore } from "src/stores/chat-store"
import { TYPE_IMAGE, TYPE_TEXT, getDateFromId, getMsecTimestamp } from "src/api/dto/message/message-const";
import { SimpleChatMessage } from "src/api/dto/message/simple-message";
import { MessageShown } from "src/api/entity/message";
import { ref } from "vue";
import { watch } from "vue";
import { computed } from "vue";
import { getHistoryMessage, getImage } from "src/api/http/server-chat";
import { useI18n } from "vue-i18n"
import { getMapFromObject, getSetFromArray } from "src/api/map-and-set";
import { getMultiNames } from "src/api/http/account";
import { baseUrl } from "src/api/base-url";

const { t } = useI18n()

const dragToLoadStr = t("app.dragToLoadMessage")
const noMoreMessageStr = t("app.noMoreMessage")

const props = defineProps({
  serverId: {
    type: BigInt,
    required: true
  },
  chatId: {
    type: Number,
    required: true
  },
  uid: {
    type: BigInt,
    required: true
  },
  msgList: {
    required: true
  }
})

const emit = defineEmits(['addHistoryMessage'])

/**
 * @type {import('vue').Ref<Map<string, string>>}
 */
const idNameMap = ref(new Map())

/**
 *@type {import('vue').ComputedRef<MessageShown[]>}
 */
 const mList = computed(() => props.msgList)

watch(() => props.msgList, (newList, oldList) => {
  // console.log(props.msgList)
  // console.log(mList.value[0])
  // console.log("here")
  const nList = newList.filter(val => !oldList.includes(val))
  // console.log(newList)
  // console.log(oldList)
  // newList.forEach(val => {
  //   console.log(oldList.includes(val))
  // })
  // console.log(nList)
  getNames(nList)
})

const noMoreHistory = ref(false)
watch(() => props.serverId, () => {
  noMoreHistory.value = false
})
watch(() => props.chatId, () => {
  noMoreHistory.value = false
  if (props.chatId || props.chatId === 0) {
    console.log("loading history")
    getHistory(() => {})
  }
})

function getHistory(done) {
  console.log("drag")
  // emit('addHistoryMessage')
  // setTimeout(() => done(), 2000)
  const until = mList.value.length ? parseInt(getMsecTimestamp(mList.value[0].id)) : null
  // console.log(until)
  tryGetHistoryMessage(until, done)
}

/**
 *
 * @param {number | null} until - timestamp in msec until value (null as present)
 * @param {()=>{}} done done function
 */
function tryGetHistoryMessage(until, done) {
  // //
  // emit('addHistoryMessage', [new MessageShown(342939657535489n, -1n,"ccc",0,false)])
  // done()
  // // setTimeout(() => done(), 2000)
  // return
  // //
  // console.log(`s:${props.serverId};c:${props.chatId};u:${until}`)
  getHistoryMessage(props.serverId, props.chatId, until, null)
  .then(body => {
    /**
     * @type {MessageShown[]}
     */
    const newHistoryMessageList = body.messageList.flatMap(val => {
      return new MessageShown(BigInt(val.id), BigInt(val.userId), val.content, val.type, false)
    })
    // console.log(newHistoryMessageList)
    if (!newHistoryMessageList.length) {
      noMoreHistory.value = true
    }
    // getNames(newHistoryMessageList)
    emit('addHistoryMessage', newHistoryMessageList)
  })
  .catch(err => {
    console.log(err)
    // console.log("a")
    //
  })
  .finally(() => {
    done()
    // setTimeout(() => done(), 2000)
  })
}

const showDialog = ref(false)
const srcUrl = ref("")
/**
 * @type {import('vue').Ref<File>}
 */
const imgFile = ref(null)

// /**
//  *
//  * @param {MessageShown} msg - message
//  */
// async function getSrcFromMsg(msg) {
//   return msg.loading?msg.content: await getImgUrl(msg.content)
// }

// /**
//  *
//  * @param {MessageShown} msg - message
//  *
//  */
// async function showImageInDialog(msg) {
//   // srcUrl.value = await getSrcFromMsg(msg)
//   console.log("aaa")
//   console.log(srcUrl.value)
//   showDialog.value = true
// }

// /**
//  *
//  * @param {string} url - url
//  *
//  */
//  async function showImageInDialog(url) {
//   srcUrl.value = url
//   // console.log("aaa")
//   // console.log(srcUrl.value)
//   showDialog.value = true
// }

/**
 *
 * @param {File} file - file
 * @param {string} url - url
 */
function showImageInDialog(file, url) {
  imgFile.value = file
  srcUrl.value = url
  // console.log("aaa")
  // console.log(srcUrl.value)
  showDialog.value = true
}


// async function getImgUrl(imgName) {
//   return getImage(props.serverId, props.chatId, imgName)
//   .then(blob => {
//     return URL.createObjectURL(blob)
//   })
//   .catch(err => {
//     console.log(err)
//   })
//   // return baseUrl + `/server/${props.serverId}/chat/${props.chatId}/img/` + imgName
//   // return imgName
// }

/**
 *
 * @param {MessageShown[]} newMessageList - new message list
 */
function getNames(newMessageList) {
  if (!newMessageList.length) {
    return
  }
  const newIds = []
  getSetFromArray(newMessageList.flatMap(val => val.userId))
  .forEach(val => {
    // console.log(val)
    if (idNameMap.value.get(val) === undefined) {
      newIds.push(val)
      // console.log("set")
    }
  })
  if (newIds.length) {
    getMultiNames(getSetFromArray(newIds))
    .then(body => {
      idNameMap.value = new Map([
        ...idNameMap.value,
        ...getMapFromObject(body.nameMap)
      ])
      // console.log("map get")
      // console.log(idNameMap.value)
      // updateName.value = true
    })
    .catch(err => console.log(err))
    .finally(() => {})
  }
}

/**
 *
 * @param {bigInt} uid - user ID
 * @returns {string}
 */
function getNameFromId(uid) {
  const n = idNameMap.value.get(uid.toString())
  // console.log("read name" + n)
  return n === undefined ? uid.toString() : n
}

// const updateName = ref(false)
// watch(() => updateName.value, (newUpdate) => {
//   if (newUpdate) {
//     updateName.value = false
//     // console.log("getName")
//   }
// })

// console.log(props.serverId)
// console.log(props.chatId)

// const chatStore = useChatStore(store())

// const authStore = useAuthStore(store())
// /**
//  * @type {import('vue').Ref<bigint>}
//  */
// const userId = computed(() => authStore.uid ? authStore.uid : -1n)

// console.log(uid)
// const messageList = chatStore.getChatMessageList(props.serverId, props.chatId)
// const messageListSample = [
//   new SimpleChatMessage(
//     342939657535488n,
//     BigInt(0).toString(),
//     "iii",
//     0
//   ),
//   new SimpleChatMessage(
//     342939657535489n,
//     BigInt(-1).toString(),
//     "https://picsum.photos/500/300",
//     1
//   ),
//   new SimpleChatMessage(
//     342939657535490n,
//     BigInt(0).toString(),
//     "iii2",
//     0
//   ),
//   new SimpleChatMessage(
//     342939657535491n,
//     BigInt(0).toString(),
//     "iii3",
//     0
//   ),
//   new SimpleChatMessage(
//     342939657535588n,
//     BigInt(0).toString(),
//     "iii5",
//     0
//   ),
//   new SimpleChatMessage(
//     342939657535600n,
//     BigInt(0).toString(),
//     "iii5n111",
//     0
//   ),
//   new SimpleChatMessage(
//     342939657535700n,
//     BigInt(0).toString(),
//     "iii5n111",
//     0
//   ),
//   new SimpleChatMessage(
//     342938657532800n,
//     BigInt(0).toString(),
//     "iii5n11100000",
//     0
//   ),
// ]

// /**
//  *
//  * @param {bigInt} a
//  * @param {bigInt} b
//  * @returns {number}
//  */
// function compBigInt(a, b) {
//   return a > b ? 1 : (a < b ? -1 : 0)
// }

// /**
//  *
//  * @param {bigInt} sid - server ID
//  * @param {number} cid - chat ID
//  * @returns {MessageShown[]}
//  */
//  function updateMessageList(sid, cid) {
//   console.log(`sid:${sid};cid:${cid}`)
//   if ((sid || sid === 0) && (cid || cid === 0)) {
//     console.log("update")
//     const tmp = chatStore.getChatMessageList(sid, cid)
//     return (tmp?tmp:messageListSample)
//       .sort((a,b)=>{return compBigInt(a.id, b.id)})
//   }
//   return null
//     // .flatMap(it => MessageShown.fromSimpleMessage(it))
// }

// /**
//  * @type {import("vue").Ref<MessageShown[]>}
//  */
// const messageList = ref(updateMessageList(props.serverId, props.chatId))

// const sortedMessageList = computed(() => {
//   if (messageList.value) {
//     return getShownMessageList(messageList.value)
//   }
//   return null
// })

// watch(() => props.serverId, (newId) => {
//   messageList.value = updateMessageList(newId, props.chatId)
// })
// watch(() => props.chatId, (newId) => {
//   messageList.value = updateMessageList(props.serverId, newId)
// })

// watch(() => chatStore.getChatMessageList(props.serverId, props.chatId).length, (newLen) => {
//   messageList.value = updateMessageList(props.serverId, props.chatId)
// })

// watch(() => {
//   const t = computed(() => chatStore.getChatMessageList(props.serverId, props.chatId))
//   t.value?t.value.length:0
// }, () => {
//   messageList.value = updateMessageList(props.serverId, props.chatId)
// })
</script>


<style scoped>
.q-scrollarea.col > .q-scrollarea__container {
  position: absolute;
}
</style>
