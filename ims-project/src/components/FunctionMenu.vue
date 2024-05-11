<template>
  <DialogError
    v-model="dialogErrorShown"
    :title="dialogErrorTitle"
    :content="dialogErrorContent"
    :onHide="dialogErrorCallback"
  />
  <q-list>
    <q-item
      clickable
      target="_blank"
      @click="showUserInfo = true"
    >
      <q-item-section avatar>
        <q-icon name="person" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ userInfoStr }}</q-item-label>
        <DialogUserInfo v-model="showUserInfo" :uid="uid" />
      </q-item-section>
    </q-item>
    <q-item
      clickable
      target="_blank"
      @click="showAddServer = true"
    >
      <q-item-section avatar>
        <q-icon name="dns" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ addServerStr }}</q-item-label>
        <DialogAddServer v-model="showAddServer" @add-new-server="newServerAdded" />
      </q-item-section>
    </q-item>
    <q-item-label header>
      <!-- <q-item-section avatar>
        <q-icon name="dns" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ serverListStr }}</q-item-label>
      </q-item-section> -->
      {{ serverListStr }}
    </q-item-label>
    <q-item
      clickable
      target="_blank"
      @click="getServerList"
    >
      <q-item-section avatar>
        <q-icon name="refresh" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ refreshServerStr }}</q-item-label>
      </q-item-section>
      <q-inner-loading :showing="refreshingServer" />
    </q-item>
    <q-separator />
    <q-item
      v-for="sid in serverIdList"
      :key="sid"
      clickable
      target="_blank"
      @click="routeTo(sid)"
    >
      <q-item-section>
        <q-item-label>{{ serverMap.get(sid) }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import DialogUserInfo from "./dialog/DialogUserInfo.vue";
import DialogAddServer from "./dialog/DialogAddServer.vue";
import store from "src/stores/index";
import { useChatStore } from "src/stores/chat-store";
import { useRouter } from 'vue-router';
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { getAccountInfo, getServerNames } from "src/api/http/account";
import { getMapFromObject } from "src/api/map-and-set";
import { computed } from "vue";
import { watch } from "vue";
import DialogError from "./dialog/DialogError.vue";

const props = defineProps({
  uid: {
    type: BigInt,
    required: true
  },
  // load: {
  //   type: Boolean,
  //   required: true
  // }
})

const showUserInfo = ref(false)
const showAddServer = ref(false)

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

const userInfoStr = t("app.user.userInfo")
const serverListStr = t("app.server.serverList")
const addServerStr = t("app.server.addServer")
const refreshServerStr = t("app.server.refreshServer")

const errorStr = t("error")

const chatStore = useChatStore()
// const sidList = ref(
//   // chatStore.getServerIdList()?chatStore.getServerIdList():
//   [BigInt(0), BigInt(1)]
// )

/**
 * @type {import('vue').Ref<Map<bigint, String>>}
 */
const serverMap = ref(new Map())

const serverIdList = computed(() => Array.from(serverMap.value.keys()))

const refreshingServer = ref(false)

function getServerList() {
  if (refreshingServer.value) {
    return
  }
  refreshingServer.value = true
  // //
  // serverMap.value = new Map([
  //   [0n, "0server0"],
  //   [1n, "0server1"],
  //   [3n, "1server3"]
  // ])
  // refreshingServer.value = false
  // return
  // //
  getServerNames(BigInt(props.uid))
  .then(body => {
    serverMap.value = getMapFromObject(body.serverNameMap)
  })
  .catch(err => {
    console.log(err)
  })
  .finally(() => {
    refreshingServer.value = false
  })
}

// if (!serverMap.value.size) {
//   getServerList()
// }

watch(() => props.uid, () => {
  if (props.uid || props.uid === BigInt(0)) {
    if (props.uid !== BigInt(-1)) {
      getServerList()
      getUserInfo(props.uid)
    }
  }
})

if (props.uid || props.uid === BigInt(0)) {
  if (props.uid !== BigInt(-1)) {
    getServerList()
    getUserInfo(props.uid)
  }
}

watch(() => serverMap.value.size, () => {
  getUserInfo(props.uid)
})

/**
 *
 * @param {bigInt} uid - user ID
 */
 function getUserInfo(uid) {
  getAccountInfo(uid)
  .then(body => {
    // console.log(body)
    chatStore.updateAccountInfo(body)
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally()
}

// console.log(props.load)

// watch(() => props.load, (newLoad) => {
//   console.log(`${newLoad} here`)
//   if (newLoad) {
//     getUserInfo(props.uid)
//     getServerList()
//   }
// })

// watch(() => props.uid, () => {
//   console.log(props.uid)
//   console.log("hhhhhhhhh")
//   if (props.uid || props.uid === 0n) {
//     if (props.uid !== -1n) {
//       getUserInfo(props.uid)
//     }
//   }
// })

/**
 *
 * @param {bigInt} sid - server ID
 * @param {string} name - server name
 */
function newServerAdded(sid, name) {
  serverMap.value.set(sid, name)
}

const router = useRouter()
/**
 *
 * @param {bigInt} sid - server ID
 */
function routeTo(sid) {
  router.push({ name: "app", params: { serverId: sid.toString() } })
}
</script>
