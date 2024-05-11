<template>
  <q-item
    clickable
    target="_blank"
    @click="dialogShown = true"
  >
    <div v-if="uname.length">{{ uname }} ({{ uid }})</div>
    <div v-else>{{ uid }}</div>
  </q-item>
  <q-dialog v-model="dialogShown">
    <q-card>
      <q-card-section>{{ accountName }} ({{ uid }})</q-card-section>
      <q-separator />
      <q-card-section class="column flex-center">
        <div>{{ eMailStr }}: {{ accountEmail }}</div>
        <div>{{ serverListStr }}: {{ serverString }}</div>
      </q-card-section>
    </q-card>
    <q-inner-loading :showing="loading" />
  </q-dialog>
</template>
<script setup>
import { getAccountInfo } from 'src/api/http/account';
import { computed } from 'vue';
import { watch } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const eMailStr = t("app.user.eMail")
const serverListStr = t("app.server.serverList")

const props = defineProps({
  uid: {
    type: BigInt,
    required: true
  },
  uname: {
    type: String,
    required: true
  }
})

const loading = ref(false)

const accountName = ref("")
const accountEmail = ref("")
/**
 * @type {import('vue').Ref<string[]>}
 */
const serverList = ref([])
const serverString = computed(() => {
  let str = ""
  serverList.value.forEach(val => {
    str += val + ", "
  })
  return str
})

function tryGetUserInfo(uid) {
  loading.value = true
  // //
  // loading.value = false
  // accountName.value = props.uname
  // accountEmail.value = "111@gm.com"
  // serverList.value = ["0","1"]
  // return
  // //
  getAccountInfo(uid)
  .then(body => {
    accountName.value = body.name?body.name:""
    accountEmail.value = body.email?body.email:""
    serverList.value = body.servers?body.servers:""
  })
  .catch(err => {
    console.log(err)
    //
  })
  .finally(() => {
    loading.value = false
  })
}

const dialogShown = ref(false)
watch(() => dialogShown.value, (isShown) => {
  if (isShown) {
    tryGetUserInfo(props.uid)
  }
})
</script>
