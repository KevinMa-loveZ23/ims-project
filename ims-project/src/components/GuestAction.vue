<template>
  <q-item
    clickable
    tag="a"
    target="_blank"
    @click="routeTo(routeName)"
  >
    <!-- :href="link" -->
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineProps({
  title: {
      type: String,
      required: true
    },
  routeName: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})

const router = useRouter()
/**
 *
 * @param {string} routeName - Name of route destination
 */
function routeTo(routeName) {
  router.push({ name: routeName })
}
</script>

<!-- <script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GuestAction',
  props: {
    title: {
      type: String,
      required: true
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  }
})
</script> -->
