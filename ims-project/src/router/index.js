import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/user-id-store'
import store from "src/stores/index";
import { useChatStore } from 'src/stores/chat-store';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from) => {
    const authStore = useAuthStore()
    const chatStore = useChatStore()
    if (to.name !== 'app') {
      if (!authStore.isTokenEmpty) {
        return {
          name: 'app'
        }
      }
    }
    if (to.name === 'app') {
      if (authStore.isTokenEmpty) {
        return {
          name: 'guest'
        }
      }
    }
    if (to.name === 'app' && to.params.serverId) {
      // console.log(to.params.serverId)
      const serverList = chatStore.accountInfo?chatStore.accountInfo.servers:[]
      // console.log(serverList)
      if (!serverList.includes(to.params.serverId)) {
        return {
          name: 'app'
        }
      }
    }
    return true
  })

  return Router
})
