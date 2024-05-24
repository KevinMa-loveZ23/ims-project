<template>
  <div
    @click="showImageInDialog()"
  >
    <q-img
      :src="url"
      :placeholder-src="placeHolder"
      no-native-menu
    >
      <q-inner-loading :showing="loading" />
    </q-img>
  </div>
</template>
<script setup>
import { MessageShown } from "src/api/entity/message";
import { computed, ref } from "vue";
import { getImage } from "src/api/http/server-chat";
import { TYPE_IMAGE } from "src/api/dto/message/message-const";
const props = defineProps({
  msg: {
    type: MessageShown,
    required: true
  },
  serverId: {
    type: BigInt,
    required: true
  },
  chatId: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['showImg'])

const url = ref(null)
const imgFile = ref(null)
// const url = computed((() => URL.createObjectURL(imgFile.value)))
const loading = ref(false)

function showImageInDialog() {
  if (!url.value) {
    return
  }
  // emit('showImg', url.value)
  // console.log(imgFile.value)
  emit('showImg', imgFile.value, url.value)
}

function getSrcFromMsg() {
  if (props.msg.loading) {
    url.value = props.msg.content
    return
  }
  loading.value = true
  getImage(props.serverId, props.chatId, props.msg.content)
  .then(iFile => {
    // const reader = new FileReader()
    // reader.readAsDataURL(blob)
    // reader.onload = (event) => {
    //   url.value = event.target.result
    // }
    // url.value =  URL.createObjectURL(blob)
    imgFile.value = iFile
    url.value = URL.createObjectURL(iFile)
  })
  .catch(err => {
    console.log(err)
  })
  .finally(() => {
    loading.value = false
  })
}

if (props.msg.type == TYPE_IMAGE) {
  getSrcFromMsg()
}

const placeHolder = "data:image/jpeg;base64,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"

</script>
