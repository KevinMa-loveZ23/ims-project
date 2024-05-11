<template>
  <q-dialog v-model="alert" @hide="onHide">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ content }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="btnLabel" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
/**
 * @type {import("vue").Ref<Boolean>}
 */
const alert = defineModel()

defineProps({
  // alert: {
  //   type: Boolean,
  //   required: true
  // }
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  btnLabel: {
    type: String,
    default: "OK"
  },
  onHide: {
    default: () => {}
  }
})
</script>
