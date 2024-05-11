<template>
  <q-dialog
    persistent
    v-model="model"
  >
    <DialogError
      v-model="dialogErrorShown"
      :title="dialogErrorTitle"
      :content="dialogErrorContent"
      :onHide="dialogErrorCallback"
    />
    <q-card>
      <q-bar>
        <div>{{ userInfoStr }}</div>
        <q-space />
        <q-btn flat icon="close" :disable="!disableModify" v-close-popup />
      </q-bar>
      <q-separator />
      <q-card-actions vertical>
        <q-btn
          icon="logout"
          :disable="!disableModify"
          @click="tryLogOut"
        >
          {{ logOutStr }}
          <q-inner-loading :showing="loggingOut" />
        </q-btn>
        <q-btn
          icon="key"
          :disable="!disableModify"
          @click="showChangePassword = true"
        >
          {{ modifyPasswordStr }}
          <q-dialog
            v-model="showChangePassword"
            @hide="oldPw = ''; newPw = ''; repeatNewPw = '';"
          >
            <q-card>
              <q-card-section>{{ modifyPasswordStr }}</q-card-section>
              <q-separator />
              <q-card-section>
                {{ oldPasswordStr }}:
                <q-input
                  ref="oldPwRef"
                  v-model="oldPw"
                  square
                  filled
                  type="password"
                  :rules="passwordRules"
                  lazy-rules
                ></q-input>
                {{ newPasswordStr }}:
                <q-input
                  ref="newPwRef"
                  v-model="newPw"
                  square
                  filled
                  type="password"
                  :rules="passwordRules"
                  lazy-rules
                ></q-input>
                {{ repeatPasswordStr }}:
                <q-input
                  ref="repeatNewPwRef"
                  v-model="repeatNewPw"
                  square
                  filled
                  type="password"
                  :rules="repeatPasswordRules"
                  lazy-rules
                ></q-input>
              </q-card-section>
              <q-card-actions vertical>
                <q-btn
                  v-close-popup
                >
                  <q-icon left name="cancel" />
                  {{ cancelStr }}
                </q-btn>
                <q-btn @click="changePassword">
                  <q-icon left name="refresh"/>
                  {{ modifyPasswordStr }}
                  <q-inner-loading :showing="changingPassword"/>
                </q-btn>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-btn>
        <q-separator inset />
        <q-btn
          @click="saveChanges"
          icon="manage_accounts"
        >
          {{ disableModify?modifyInfoStr:saveChangeStr }}
        </q-btn>
      </q-card-actions>
      <q-separator />
      <q-card-section>
        <div class="column flex-center">
          <div>
            {{ accountStr }}: {{ uid }}
          </div>
          <div>
            {{ userNameStr }}: {{ userName }}
            <CustomPopupEdit
              v-model="userName"
              :validate="userNameValidator"
              :rules="userNameRules"
              :disable="disableModify"
            />
          </div>
          <div>
            {{ eMailStr }}: {{ userEmail }}
            <CustomPopupEdit
              v-model="userEmail"
              :validate="eMailValidator"
              :rules="eMailAddressRules"
              :disable="disableModify"
            />
          </div>
          <div>
            <q-toggle
              v-model="pEmail"
              :label="publishEmailStr"
              left-label
              :disable="disableModify"
            />
          </div>
          <div>
            <q-toggle
              v-model="pServer"
              :label="publishServerStr"
              left-label
              :disable="disableModify"
            />
          </div>
        </div>
        <q-inner-loading :showing="savingChanges" />
      </q-card-section>
      <q-separator />
      <q-card-actions vertical>
        <q-btn
          color="red"
          :disable="disableModify"
          @click="openDeleteConfirm = true"
        >
          <q-icon left name="delete_forever" />
          {{ deleteAccountStr }}
          <q-dialog
            v-model="openDeleteConfirm"
            @hide="deleteAccountPassword = ''"
          >
            <q-card>
              <q-card-section>{{ doYouReallyWantToDeleteAccountStr }}</q-card-section>
              <q-separator />
              <q-card-section>
                {{ pleaseInputPasswordStr }}:
                <q-input
                  ref="passwordInputRef"
                  v-model="deleteAccountPassword"
                  square
                  filled
                  type="password"
                  :rules="passwordRules"
                  lazy-rules
                ></q-input>
              </q-card-section>
              <q-card-actions vertical>
                <q-btn v-close-popup><q-icon left name="cancel" />{{ cancelStr }}</q-btn>
                <q-btn color="red" @click="tryDeleteAccount(deleteAccountPassword)">
                  <q-icon left name="delete_forever"/>
                  {{ deleteForeverStr }}
                  <q-inner-loading :showing="deletingAccount" />
                </q-btn>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import CustomPopupEdit from 'src/components/CustomPopupEdit.vue'
import { AccountInfoBody } from 'src/api/dto/response/response-account';
import { makeEMailAddressRules, makePasswordRules, makeUserNameRules, eMailValidator, userNameValidator } from 'src/api/rules';
import { ref } from 'vue';
import { useI18n } from "vue-i18n";
import DialogError from './DialogError.vue';
import { logOut } from 'src/api/http/auth';
import { deleteAccount, getAccountInfo, modifyAccountPassword } from 'src/api/http/account';
import store from "src/stores/index";
import { useAuthStore } from "src/stores/user-id-store";
import { useChatStore } from "src/stores/chat-store"
import { modifyAccountInfo } from 'src/api/http/account';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

const model = defineModel()

const router = useRouter()

const props = defineProps({
  uid: {
    type: BigInt,
    required: true
  }
})

const authStore = useAuthStore()
const chatStore = useChatStore()

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
const modifyPasswordStr = t("app.user.userInfoStrings.modifyPassword")
const logOutStr = t("app.user.userInfoStrings.logOut")
const modifyInfoStr = t("app.user.userInfoStrings.modifyInfo")
const saveChangeStr = t("app.user.userInfoStrings.saveChange")

const oldPasswordStr = t("app.user.userInfoStrings.oldPassword")
const newPasswordStr = t("app.user.userInfoStrings.newPassword")
const repeatPasswordStr = t("app.user.userInfoStrings.repeatPassword")

const accountStr = t("app.user.account")
const userNameStr = t("app.user.userName")
const eMailStr = t("app.user.eMail")
const publishEmailStr = t("app.user.userInfoStrings.publishEmail")
const publishServerStr = t("app.user.userInfoStrings.publishServer")

const deleteAccountStr = t("app.user.userInfoStrings.deleteAccount")
const doYouReallyWantToDeleteAccountStr = t("app.user.userInfoStrings.doYouReallyWantToDeleteAccount")
const pleaseInputPasswordStr = t("app.user.userInfoStrings.pleaseInputPassword")

const eMailAddressEmptyError = t("auth.error.eMailAddressEmptyError")
const eMailAddressIllegalError = t("auth.error.eMailAddressIllegalError")
const eMailAddressTooLongError = t("auth.error.eMailAddressTooLongError")

const userNameEmptyError = t("auth.error.userNameEmptyError")
const userNameTooLongError = t("auth.error.userNameTooLongError")

const passwordEmptyError = t("auth.error.passwordEmptyError")
const passwordTooShortError = t("auth.error.passwordTooShortError")
const passwordTooLongError = t("auth.error.passwordTooLongError")
const passwordNotComplexError = t("auth.error.passwordNotComplexError")
const passwordNotMatchError = t("auth.error.passwordNotMatchError")

const errorStr = t("error")
const illegalArgumentsStr = t("auth.error.illegalArguments")
const successStr = t("success")
const deleteAccountSuccessStr = t("app.user.deleteAccountSuccess")

const cancelStr = t("cancel")
const deleteForeverStr = t("app.user.userInfoStrings.deleteForever")

const loggingOut = ref(false)
function tryLogOut() {
  loggingOut.value = true
  logOut()
  .then(body => {
    showDialogErrorWithCallback(successStr, "", () => {
      router.push({ name: 'guest' })
    })
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally(() => {
    loggingOut.value = false
  })
}

const showChangePassword = ref(false)

const oldPwRef = ref(null)
const newPwRef = ref(null)
const repeatNewPwRef = ref(null)
const changingPassword = ref(false)

const repeatPasswordRules = [
  (val) => (val == newPw.value) || passwordNotMatchError,
]

const oldPw = ref("")
const newPw = ref("")
const repeatNewPw = ref("")

function changePassword() {
  if (
    oldPwRef.value.hasError
    || newPwRef.value.hasError
    || repeatNewPwRef.value.hasError
    || oldPw.value.length == 0
    || newPw.value.length == 0
    || repeatNewPw.value.length == 0
  ) {
    showDialogError(errorStr, illegalArgumentsStr)
    return
  } else {
    changingPassword.value = true
    modifyAccountPassword(props.uid, oldPw.value, newPw.value)
    .then(body => {
      showDialogError(successStr, "")
    })
    .catch(err => {
    console.log(err)
      showDialogError(errorStr, err.message)
    })
    .finally(() => {
      changingPassword.value = false
    })
  }
}

const disableModify = ref(true)
const savingChanges = ref(false)

function saveChanges() {
  // console.log(`s:${savingChanges.value};d:${disableModify.value}`)
  if (savingChanges.value) {
    return
  }
  const reverse = !disableModify.value
  if (reverse) {
    savingChanges.value = true
    const newName = userName.value != accountInfo.value.name ? userName.value : null
    const newEmail = userEmail.value != accountInfo.value.email ? userEmail.value : null
    const newPEmail = pEmail.value != accountInfo.value.publishEmail ? pEmail.value : null
    const newPServer = pServer.value != accountInfo.value.publishServer ? pServer.value : null
    if (
      newName !== null
      || newEmail !== null
      || newPEmail !== null
      || newPServer !== null
    ) {
      modifyAccountInfo(
        props.uid,
        newName,
        newEmail,
        newPEmail,
        newPServer
      )
      .then(body => {
        const newInfoBody = new AccountInfoBody(
          props.uid,
          userName.value,
          userEmail.value,
          pEmail.value,
          chatStore.accountInfo.servers,
          pServer.value,
          chatStore.accountInfo.serverCreateTimes
        )
        accountInfo.value = newInfoBody
        chatStore.updateAccountInfo(newInfoBody)
        showDialogError(successStr, "")
      })
      .catch(err => {
        console.log(err)
        userName.value = accountInfo.value.name
        userEmail.value = accountInfo.value.email
        pEmail.value = accountInfo.value.publishEmail
        pServer.value = accountInfo.value.publishServer
        showDialogError(errorStr, err.message)
      })
      .finally(() => {
        disableModify.value = reverse
        savingChanges.value = false
      })
    } else {
      disableModify.value = reverse
      savingChanges.value = false
    }
  } else {
    disableModify.value = reverse
  }
}

const openDeleteConfirm = ref(false)

// const accountInfoSimple = new AccountInfoBody(
//   props.uid, "default Name", "default@email.com", true, [0n,1n,3n], true, 1
// )

/**
 * @type {import("vue").Ref<AccountInfoBody>}
 */
const accountInfo = ref(chatStore.accountInfo?chatStore.accountInfo:null)

const userName = ref(accountInfo.value?accountInfo.value.name:"")
const userEmail = ref(accountInfo.value?accountInfo.value.email:"")
const pEmail = ref(accountInfo.value?accountInfo.value.publishEmail:true)
const pServer = ref(accountInfo.value?accountInfo.value.publishServer:true)

// watch(() => chatStore.accountInfo, (newInfo) => {
//   accountInfo.value = newInfo
// })

/**
 *
 * @param {bigInt} uid - user ID
 */
function getUserInfo(uid) {
  // //
  // console.log('get user info: ' + uid)
  // accountInfo.value = accountInfoSimple
  // userName.value = accountInfo.value.name
  // userEmail.value = accountInfo.value.email
  // pEmail.value = accountInfo.value.publishEmail
  // pServer.value = accountInfo.value.publishServer
  // chatStore.updateAccountInfo(accountInfoSimple)
  // console.log(chatStore.accountInfo.serverCreateTimes)
  // return
  // //
  getAccountInfo(uid)
  .then(body => {
    accountInfo.value = body
    // console.log(body)
    userName.value = accountInfo.value.name
    userEmail.value = accountInfo.value.email
    pEmail.value = accountInfo.value.publishEmail
    pServer.value = accountInfo.value.publishServer
    chatStore.updateAccountInfo(body)
  })
  .catch(err => {
    console.log(err)
    showDialogError(errorStr, err.message)
  })
  .finally()
}

// if (!accountInfo.value) {
//   getUserInfo(props.uid)
// }

watch(() => props.uid, () => {
  if (props.uid || props.uid === BigInt(0)) {
    if (props.uid !== BigInt(-1)) {
      getUserInfo(props.uid)
    }
  }
})
watch(() => model.value, (newVal) => {
  if (newVal) {
    getUserInfo(props.uid)
  }
})

const eMailAddressRules = makeEMailAddressRules(
  eMailAddressEmptyError,
  eMailAddressTooLongError,
  eMailAddressIllegalError
)
const userNameRules = makeUserNameRules(
  userNameEmptyError,
  userNameTooLongError
)

const passwordInputRef = ref(null)
const passwordRules = makePasswordRules(
  passwordEmptyError,
  passwordTooShortError,
  passwordTooLongError,
  passwordNotComplexError
)

const deleteAccountPassword = ref("")
const deletingAccount = ref(false)
/**
 *
 * @param {string} password - password
 */
function tryDeleteAccount(password) {
  // console.log(`uid:${props.uid};pw:${password}`)
  if (passwordInputRef.value.hasError || deleteAccountPassword.value.length == 0) {
    showDialogError(errorStr, illegalArgumentsStr)
    return
  } else {
    deletingAccount.value = true
    deleteAccount(BigInt(props.uid), password)
    .then(body => {
      // clear token
      authStore.clearToken()
      //clear chat
      chatStore.clear()
      showDialogErrorWithCallback(
        successStr,
        `${accountStr} ${body.id} ${deleteAccountSuccessStr}`,
        () => {
          router.push({ name: 'guest' })
        }
      )
    })
    .catch(err => {
      console.log(err)
      showDialogError(errorStr, err.message)
    })
    .finally(() => {
      deletingAccount.value = false
    })
  }
}

</script>
