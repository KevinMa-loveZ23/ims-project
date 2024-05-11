<template>
  <div
    @click="showImageInDialog()"
  >
    <q-img
      :src="url"
    />
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
}

if (props.msg.type == TYPE_IMAGE) {
  getSrcFromMsg()
}

</script>
