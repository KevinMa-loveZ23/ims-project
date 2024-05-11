import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/user-id-store'
import store from "src/stores/index"
import { useChatStore } from 'src/stores/chat-store'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  const authStore = useAuthStore(store())
  const chatStore = useChatStore(store())
})
