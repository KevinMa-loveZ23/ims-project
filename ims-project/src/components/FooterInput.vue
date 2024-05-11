<template>
  <div>
    <q-tooltip v-model="showTip">{{ tipMessage }}</q-tooltip>
  </div>
  <div class="row no-warp">
    <div class="col">
      <div v-show="textInputShown">
        <q-input
          style="width: auto;"
          v-model="text"
          filled
          autogrow
        />
      </div>
      <div v-show="!textInputShown">
        <q-file
          filled
          bottom-slots
          v-model="file"
          :label="imageFileLabel"
          counter
          :counter-label="counterLabelFn"
          accept="image/*"
          :max-file-size="maxFileSize"
          clearable
        >
          <!-- use-chips -->
          <!-- max-files="1" -->
          <template v-slot:before>
            <q-icon name="image" />
          </template>

          <template v-slot:hint>
            {{ imageFileHint }}
          </template>

          <!-- <template v-slot:append>
            <q-icon name="close" @click.stop.prevent="file = null" class="cursor-pointer" />
          </template> -->
        </q-file>
      </div>
    </div>
    <q-separator spaced vertical />
    <div class="col-auto row">
      <div
        class="column flex-center"
      >
        <q-btn icon="send" stack :label="sendStr" @click="upload(textInputShown)"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const sendStr = t("app.input.send")
const imageFileLabel = t("app.input.imageFileLabel")
const imageFileHint = t("app.input.imageFileHint")

const emptyText = t("app.input.error.emptyText")
const emptyImage = t("app.input.error.emptyImage")

const maxFileSize = 20 * 1024 * 1024
// const imageFileMaxSize = "20MB"

const emit = defineEmits(['newTextMessage', 'newImageMessage'])

defineProps({
  textInputShown: {
    type: Boolean,
    required: true
  },
})
/**
 * @type {import("vue").Ref<File>}
 */
const file = ref(null)
/**
 * @type {import("vue").Ref<string>}
 */
const text = ref("")

const showTip = ref(false)
const tipMessage = ref("")
function showTipWithMessage(message) {
  tipMessage.value = message
  showTip.value = true
  setTimeout(() => showTip.value = false, 2000)
}

function counterLabelFn({ totalSize, filesNumber, maxFiles }) {
  return `${totalSize}`
}

function upload(isTextInputShown) {
  if (isTextInputShown) {
    const textStr = text.value
    if (textStr.length) {
      emit('newTextMessage', textStr)
      console.log("text upload")
    } else {
      showTipWithMessage(emptyText)
    }
    text.value = ""
  } else {
    const fileObj = file.value
    if (fileObj && fileObj.size) {
      emit('newImageMessage', fileObj)
      console.log("image upload")
    } else {
      showTipWithMessage(emptyImage)
    }
    file.value = null
  }
}
</script>
