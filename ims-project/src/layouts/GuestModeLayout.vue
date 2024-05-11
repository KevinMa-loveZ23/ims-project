<template>
  <q-layout view="lHh LpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          {{ title }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item-label header>{{ drawerTitle }}</q-item-label>
        <GuestAction
          v-for="link in authLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import GuestAction from 'src/components/GuestAction.vue';
import { ref, watch } from 'vue';
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router';

const leftDrawerOpen = ref(false)
function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const route = useRoute()

const { t } = useI18n();

const logInTitle = t("auth.login.logIn");
const signInTitle = t("auth.signin.signIn");
const drawerTitle = t("auth.welcome");

const authLinks = [
  {
    title: logInTitle,
    icon: 'login',
    routeName: 'log-in'
  },
  {
    title: signInTitle,
    icon: 'how_to_reg',
    routeName: 'sign-in'
  },
]

const title = ref(getTitle(route.name))

/**
 *
 * @param {string} routeName - route name
 */
function getTitle(routeName) {
  switch (routeName) {
    case authLinks[0].routeName:
      return authLinks[0].title

    case authLinks[1].routeName:
      return authLinks[1].title

    default:
      return ""
  }
}

watch(
  () => route.name,
  newName => {
    title.value = getTitle(newName)
  }
)

</script>

<!-- <script>
import GuestDrawer from 'src/components/GuestDrawer.vue'
</script> -->
