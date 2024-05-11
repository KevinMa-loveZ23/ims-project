<template>
  <q-page padding>
    <DialogError v-model="showDialog" :title="dialogTitle" :content="dialogContent" />
    <q-card
      style="width: fit-content; margin: auto;"
    >
      <q-item>
        <q-item-section>
          <q-item_label>{{ logInTitle }}</q-item_label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-card-section>
        <div>
          <q-input
            ref="accountInputRef"
            square
            filled
            v-model="account"
            :label="accountStr"
            :rules="accountRules"
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
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-actions vertical>
        <q-btn
          flat
          @click="tryLogIn(account, password)"
        >
          {{ logInBtnStr }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import store from "src/stores/index";
import { useAuthStore } from "src/stores/user-id-store";
import { makeAccountRules, makePasswordRules } from "src/api/rules";
import { logIn } from "src/api/http/auth"
import DialogError from "src/components/dialog/DialogError.vue";
import { useRouter } from 'vue-router';

const { t } = useI18n();

const logInTitle = t("auth.login.logIn")
const logInBtnStr = t("auth.login.logIn")
const accountStr = t("auth.login.account")
const passwordStr = t("auth.login.password")

const accountEmptyError = t("auth.error.accountEmptyError")
const accountTooLongError = t("auth.error.accountTooLongError")
const accountNotNumberError = t("auth.error.accountNotNumberError")

const passwordEmptyError = t("auth.error.passwordEmptyError")
const passwordTooShortError = t("auth.error.passwordTooShortError")
const passwordTooLongError = t("auth.error.passwordTooLongError")
const passwordNotComplexError = t("auth.error.passwordNotComplexError")

const failMessage = t("auth.login.error.failed")
const mismatchMessage = t("auth.login.error.mismatch")

const errorStr = t("error")
const illegalArgumentsStr = t("auth.error.illegalArguments")

const account = ref("");
const accountInputRef = ref(null);
const password = ref("");
const passwordInputRef = ref(null);
const isPwdHiden = ref(true);

// const accountRules = [
//   (val) => (val && val.length > 0) || accountEmptyError,
//   (val) => isPureNumber(val) || accountNotNumberError,
// ];
const accountRules = makeAccountRules(
  accountEmptyError,
  accountTooLongError,
  accountNotNumberError
)
// const passwordRules = [(val) => (val && val.length > 0) || passwordEmptyError];
const passwordRules = makePasswordRules(
  passwordEmptyError,
  passwordTooShortError,
  passwordTooLongError,
  passwordNotComplexError
)
// /**
//  *
//  * @param {string} password - Password
//  * @returns {Promise<string>}
//  */
//  async function hashPassword(password) {
//   return digestMessage(password, "SHA-512");
// }

const authStore = useAuthStore();

function isValidated() {
  return !(
    accountInputRef.value.hasError
    || passwordInputRef.value.hasError
    || account.value.length == 0
    || password.value.length == 0)
}

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

const router = useRouter()

/**
 * @param {string} account - Account
 * @param {string} password - Password
 */
 function tryLogIn(account, password) {
  if (isValidated()) {
    // console.log("account:" + account + ";password:" + password)
    logIn(BigInt(account), password, failMessage, mismatchMessage)
    .then((token) => {
      // console.log(token)
      authStore.updateToken(token)
      router.push({ name: "app" })
    })
    .catch((err) => {
      popDialog(errorStr, err.message)
      console.log(err)
    })
  } else {
    popDialog(errorStr, illegalArgumentsStr)
    console.log("illegal")
  }
  // logIn(account, password, t("auth.login.error.failed"))
  //   .then((token) => {
  //     authStore.updateToken(token);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
}

</script>
