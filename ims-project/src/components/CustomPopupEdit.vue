<template>
  <q-popup-edit
    v-model="model"
    v-slot="scope"
    :validate="validate"
    :disable="disable"
  >
  <!-- buttons -->
    <q-input
      v-model="scope.value"
      dense
      autofocus
      counter
      @keyup.enter="scope.set"
      :rules="rules"
      lazy-rules
    >
      <template v-slot:after>
        <q-btn
          flat dense color="negative" icon="cancel"
          @click.stop.prevent="scope.cancel"
        />

        <q-btn
          flat dense color="positive" icon="check_circle"
          @click.stop.prevent="scope.set"
          :disable="scope.validate(scope.value) === false || scope.initialValue === scope.value"
        />
      </template>
    </q-input>
  </q-popup-edit>
</template>

<script setup>
const model = defineModel()
defineProps({
  validate: {
    required: true
  },
  rules: {
    required: true
  },
  disable: {
    type: Boolean,
    default: false
  }
})
</script>
