<template>
  <q-dialog v-model="shown">
    <q-card>
      <q-card-section>
        <div
          style="min-width: 25vw;"
        >
          <q-img
            :src="srcUrl"
            @click="showFullScreen = true"
          />
          <q-dialog
            v-model="showFullScreen"
          >
            <q-img
              :src="srcUrl"
              @click="showFullScreen = false"
            />
          </q-dialog>
        </div>
      </q-card-section>
      <q-card-actions>
        <q-space />
        <q-btn
          icon="download"
          @click="downloadImg"
        />
      </q-card-actions>
      <!-- <q-separator />
      <q-card-section>

      </q-card-section> -->
<!--
      <q-card-section>
        <q-btn
          fab
          color="primary"
          icon="place"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            Cafe Basilico
          </div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" />
            250 ft
          </div>
        </div>

        <q-rating v-model="stars" :max="5" size="32px" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">
          $・Italian, Cafe
        </div>
        <div class="text-caption text-grey">
          Small plates, salads & sandwiches in an intimate setting.
        </div>
      </q-card-section> -->

      <!-- <q-separator /> -->

      <!-- <q-card-actions align="right"> -->
        <!-- <q-btn v-close-popup flat color="primary" label="Reserve" /> -->
        <!-- <q-btn flat color="primary" round icon="download" /> -->
      <!-- </q-card-actions> -->
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";

/**
 * @type {import("vue").Ref<Boolean>}
 */
const shown = defineModel()

const props = defineProps({
  srcUrl: {
    type: String,
    required: true
  },
  file: {
    type: File,
    required: true
  }
})

// const url = ref("")
// watch(() => props.file, () => {
//   if (props.file) {
//     url.value = URL.createObjectURL(props.file)
//   }
// })

// const url = computed(() => URL.createObjectURL(props.file))

function downloadImg() {
  // console.log(props.file)
  const link = document.createElement('a')
  link.href = props.srcUrl
  link.download = props.file.name
  link.click()
}

const showFullScreen = ref(false)
</script>
