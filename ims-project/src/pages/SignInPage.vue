<template>
  <q-page padding>
    <DialogError v-model="showDialog" :title="dialogTitle" :content="dialogContent" :onHide="dialogOnHide" />
    <q-card
      style="width: fit-content; margin: auto;"
    >
      <q-item>
        <q-item-section>
          <q-item_label>{{ signInTitle }}</q-item_label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-card-section>
        <q-input
          ref="eMailAddressInputRef"
          square
          filled
          v-model="eMailAddress"
          :label="eMailAddressStr"
          :rules="eMailAddressRules"
          lazy-rules
        />
        <q-input
          ref="userNameInputRef"
          square
          filled
          v-model="userName"
          :label="userNameStr"
          :rules="userNameRules"
          lazy-rules
        />
        <q-input
          ref="passwordInputRef"
          square
          filled
          v-model="password"
          :type="isPwdHiden ? 'password' : 'text'"
          :label="passwordStr"
          :rules="passwordRules"
          lazy-rules
        >
          <template v-slot:append>
            <q-icon
              :name="isPwdHiden ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwdHiden = !isPwdHiden"
            />
          </template>
        </q-input>
        <q-input
          ref="repeatPasswordInputRef"
          square
          filled
          v-model="repeatPassword"
          :type="isRptPwdHiden ? 'password' : 'text'"
          :label="repeatPasswordStr"
          :rules="repeatPasswordRules"
          lazy-rules
        >
          <template v-slot:append>
            <q-icon
              :name="isRptPwdHiden ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isRptPwdHiden = !isRptPwdHiden"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-separator />
      <q-card-actions vertical>
        <q-btn
          flat
          @click="trySignIn(eMailAddress, userName, password)"
        >
          {{ signInBtnStr }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { makeEMailAddressRules, makePasswordRules, makeUserNameRules } from "src/api/rules";
import DialogError from "src/components/dialog/DialogError.vue";
import { signIn } from "src/api/http/account"
import { useRouter } from "vue-router";

const { t } = useI18n();

const signInTitle = t("auth.signin.signIn")
const signInBtnStr = t("auth.signin.signIn")
const eMailAddressStr = t("auth.signin.eMailAddress")
const userNameStr = t("auth.signin.userName")
const passwordStr = t("auth.signin.password")
const repeatPasswordStr = t("auth.signin.repeatPassword")
const accountStr = t("auth.signin.account")

const passwordEmptyError = t("auth.error.passwordEmptyError")
const passwordTooShortError = t("auth.error.passwordTooShortError")
const passwordTooLongError = t("auth.error.passwordTooLongError")
const passwordNotComplexError = t("auth.error.passwordNotComplexError")
const passwordNotMatchError = t("auth.error.passwordNotMatchError")

const eMailAddressEmptyError = t("auth.error.eMailAddressEmptyError")
const eMailAddressIllegalError = t("auth.error.eMailAddressIllegalError")
const eMailAddressTooLongError = t("auth.error.eMailAddressTooLongError")

const userNameEmptyError = t("auth.error.userNameEmptyError")
const userNameTooLongError = t("auth.error.userNameTooLongError")

const errorStr = t("error")
const illegalArgumentsStr = t("auth.error.illegalArguments")
const successStr = t("success")

const eMailAddress = ref("");
const eMailAddressInputRef = ref(null);
const userName = ref("");
const userNameInputRef = ref(null);
const password = ref("");
const passwordInputRef = ref(null);
const repeatPassword = ref("");
const repeatPasswordInputRef = ref(null);
const isPwdHiden = ref(true);
const isRptPwdHiden = ref(true);

const eMailAddressRules = makeEMailAddressRules(
  eMailAddressEmptyError,
  eMailAddressTooLongError,
  eMailAddressIllegalError
)
const userNameRules = makeUserNameRules(
  userNameEmptyError,
  userNameTooLongError
)
const passwordRules = makePasswordRules(
  passwordEmptyError,
  passwordTooShortError,
  passwordTooLongError,
  passwordNotComplexError
)
const repeatPasswordRules = [
  (val) => (val == password.value) || passwordNotMatchError,
]

function isValidated() {
  return !(eMailAddressInputRef.value.hasError
  || userNameInputRef.value.hasError
  || passwordInputRef.value.hasError
  || repeatPasswordInputRef.value.hasError
  || eMailAddress.value.length == 0
  || userName.value.length == 0
  || password.value.length == 0
  || repeatPassword.value.length == 0)
}

const showDialog = ref(false)
const dialogTitle = ref("")
const dialogContent = ref("")
const dialogOnHide = ref(()=>{})

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

/**
 *
 * @param {string} title - title
 * @param {string} content - content
 * @param {()=>{}} callback - call back
 */
function popDialogWithCallback(title, content, callback) {
  dialogOnHide.value = callback
  popDialog(title, content)
}

const router = useRouter()

/**
 *
 * @param {string} eMailAddress - E-Mail Address
 * @param {string} userName - User Name
 * @param {string} password - Password
 */
function trySignIn(eMailAddress, userName, password) {
  if (isValidated()) {
    // console.log("email:"+eMailAddress+";un:"+userName+";pw:"+password)
    signIn(eMailAddress, userName, password)
    .then((body) => {
      const uid = BigInt(body.id)
      console.log(`Please be aware that HERE IS YOUR ACCOUNT: ${uid}\nDo not miss it, and I think as you can check this console, you may have noticed this :)`)
      const uname = body.name
      const msg = `${userNameStr}: ${uname}\n${accountStr}: ${uid.toString()}`
      popDialog(successStr, msg)
      popDialogWithCallback(successStr, msg, () => {
        router.push({
          name: 'log-in'
        })
      })
    })
    .catch((err) => {
      popDialog(errorStr, err.message)
      console.log(err)
    })
  } else {
    popDialog(errorStr, illegalArgumentsStr)
    console.log("illegal")
  }
}
</script>
