<template>
  <q-dialog
    v-model="model"
    :seamless="behind"
    :position="pos"
  >
    <q-card>
      <div
      >
        <!-- v-if="!behind" -->
        <q-card-section>
          <div class="row no-warp flex-center">
            <q-spinner-tail />
            {{ connectingToServerStr }}
          </div>
        </q-card-section>
        <q-card-actions v-show="behind">
          <q-space />
          <q-btn @click="behindConnecting()">{{ placeAtBottomStr }}</q-btn>
        </q-card-actions>
      </div>
      <!-- <div
        v-else
      >
        <q-card-actions>
          //
        </q-card-actions>
      </div> -->
    </q-card>
  </q-dialog>
</template>
<script setup>
import { watch } from 'vue';
import { computed, ref } from 'vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n()
const connectingToServerStr = t("app.connectingToServer")
const cancelStr = t("cancel")
const placeAtBottomStr = t("app.placeAtBottom")

const model = defineModel()

const behind = ref(false)
const pos = computed(() => behind.value?'bottom':'')

function behindConnecting() {
  behind.value = true
}

watch(() => model.value, (newModel) => {
  if (newModel) {
    behind.value = false
  }
})
</script>
