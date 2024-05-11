<template>
  <DialogError
    v-model="dialogErrorShown"
    :title="dialogErrorTitle"
    :content="dialogErrorContent"
    :onHide="dialogErrorCallback"
  />
  <q-dialog
    v-model="model"
    :persistent="modifyingServer"
  >
    <q-card>
      <q-bar>
        <div>{{ serverIdStr }}: {{ serverInfo.serverId }}</div>
        <q-space />
        <q-btn flat icon="close" v-close-popup/>
      </q-bar>
      <q-card-actions>
        <div>
          {{ ownerStr }}: {{ adminMap.get(serverInfo?serverInfo.owner:"-1") }} ({{ serverInfo?serverInfo.owner:"-1" }})
        </div>
        <q-space />
        <div
          v-show="isUserOwner"
        >
          <q-toggle
            v-model="isAbleToSetOwner"
            color="red"
            leftLabel
          />
          <q-btn
            :disable="!isAbleToSetOwner"
            @click="showSelectOwner = true"
          >
            {{ modifyStr }}
            <q-dialog
              v-model="showSelectOwner"
            >
              <q-card>
                <q-card-section>
                  <q-label>{{ selectNewOwnerStr }}</q-label>
                  <q-select
                    v-model="selectOwner"
                    :options="ownerCandidate"
                  />
                </q-card-section>
                <q-card-actions>
                  <q-space />
                  <q-btn
                    @click="trySetNewOwner"
                  >{{ setStr }}</q-btn>
                </q-card-actions>
                <q-inner-loading :showing="modifyingServer" />
              </q-card>
            </q-dialog>
          </q-btn>
        </div>
      </q-card-actions>
      <q-separator />
      <q-card-section>
        <div class="column">
          <div>
            {{ serverNameStr }}: {{ sName }}
            <CustomPopupEdit
              v-model="sName"
              :validate="userNameValidator"
              :rules="serverNameRules"
              :disable="disableModify"
            />
          </div>
          <div>
            {{ descriptionStr }}: {{ sDes }}
            <CustomPopupEdit
              v-model="sDes"
              :validate="descriptionValidator"
              :rules="descriptionRules"
              :disable="disableModify"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn
          @click="saveChanges"
        >
          {{ mBtnStr }}
        </q-btn>
      </q-card-actions>
      <q-inner-loading :showing="modifyingServer" />
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ServerInfoBody } from 'src/api/dto/response/response-server';
import { modifyServer } from 'src/api/http/server';
import { watch } from 'vue';
import { ref } from 'vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import DialogError from './DialogError.vue';
import CustomPopupEdit from '../CustomPopupEdit.vue';
import { makeDescrptionRules, makeUserNameRules, userNameValidator, descriptionValidator } from 'src/api/rules';

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

const model = defineModel()
const props = defineProps({
  serverInfo: {
    type: ServerInfoBody,
    required: true
  },
  isUserOwner: {
    type: Boolean,
    required: true
  },
  adminMap: {
    type: Map,
    required: true
  }
})
const emit = defineEmits(['uploadModifyServerInfo'])

function uploadNameAndDescription() {
  emit('uploadModifyServerInfo', sName.value, sDes.value)
}

const errorStr = t("error")
const successStr = t("success")

const serverIdStr = t("app.server.serverId")
const serverNameStr = t("app.server.serverName")
const ownerStr = t("app.server.owner")
const descriptionStr = t("app.server.description")
const modifyStr = t("app.server.modify")

const setStr = t("app.server.set")
const selectNewOwnerStr = t("app.server.server.selectNewOwner")

const modifyInfoStr = t("app.server.server.modifyInfo")
const saveChangeStr = t("app.server.server.saveChange")

const nameEmptyErrorStr = t("app.server.error.nameEmptyError")
const nameTooLongError = t("app.server.error.nameTooLongError")
const serverNameRules = makeUserNameRules(nameEmptyErrorStr, nameTooLongError)

const descriptionEmptyErrorStr = t("app.server.error.descriptionEmptyError")
const descriptionTooLongErrorStr = t("app.server.error.descriptionTooLongError")
const descriptionRules = makeDescrptionRules(descriptionEmptyErrorStr, descriptionTooLongErrorStr)


const adminIdList = computed(() => Array.from(props.adminMap.keys()).flatMap(val => BigInt(val)))

const isAbleToSetOwner = ref(false)

const showSelectOwner = ref(false)
/**
 * @type {import('vue').Ref<bigInt>}
 */
const selectOwner = ref(null)
const ownerCandidate = computed(() => {
  return adminIdList.value
    .filter(val => val != BigInt(props.serverInfo.owner))
    .flatMap(val => {
      return { value: val, label: `${props.adminMap.get(val)} (${val})`}
    })
})
const modifyingServer = ref(false)

function trySetNewOwner() {
  if (!selectOwner.value) {
    return
  }
  // console.log(selectOwner.value.value)
  // return
  modifyingServer.value = true
  modifyServer(BigInt(props.serverInfo.serverId), null, selectOwner.value.value, null)
  .then(body => {
    showDialogErrorWithCallback(successStr, "", () => {
      location.reload()
    })
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally(() => {
    modifyingServer.value = false
  })
}

const sName = ref(props.serverInfo?props.serverInfo.name:"")
const sDes = ref(props.serverInfo?props.serverInfo.description:"")
const disableModify = ref(true)
const mBtnStr = computed(() => {
  if (disableModify.value) {
    return modifyInfoStr
  }
  return saveChangeStr
})

function saveChanges() {
  if (modifyingServer.value) {
    return
  }
  const reverse = !disableModify.value
  if (reverse) {
    // //
    // uploadNameAndDescription()
    // return
    // //
    modifyingServer.value = true
    const newName = sName.value && (sName.value != props.serverInfo.name) ? sName.value : null
    const newDescription = sDes.value && (sDes.value != props.serverInfo.description) ? sDes.value : null
    //
    if (newName !== null
      || newDescription !== null
    ) {
      modifyServer(BigInt(props.serverInfo.serverId), newName, null, newDescription)
      .then(body => {
        uploadNameAndDescription()
        showDialogError(successStr, "")
      })
      .catch(err => {
        console.log(err)
        sName.value = props.serverInfo.name
        sDes.value = props.serverInfo.description
        showDialogError(errorStr, err.message)
      })
      .finally(() => {
        disableModify.value = reverse
        modifyingServer.value = false
      })
    } else {
      disableModify.value = reverse
      modifyingServer.value = false
    }
  } else {
    disableModify.value = reverse
  }
}

watch(() => showSelectOwner.value, (newShow) => {
  if (!newShow) {
    isAbleToSetOwner.value = false
  }
})
watch(() => props.serverInfo, (newSinfo) => {
  if (props.serverInfo) {
    sName.value = props.serverInfo.name
    sDes.value = props.serverInfo.description
  }
})

</script>
