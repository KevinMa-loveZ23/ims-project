
const routes = [
  {
    path: '/',
    redirect: {
      name: 'guest'
    },
    // component: () => import('layouts/MainLayout.vue'),
    // children: [
    //   { path: '', component: () => import('pages/IndexPage.vue') }
    // ]
  },
  {
    path: '/guest',
    component: () => import('layouts/GuestModeLayout.vue'),
    name: "guest",
    meta: { requiresAuth: false },
    redirect: {
      name: 'log-in',
    },
    children: [
      { path: 'logIn', name: 'log-in', component: () => import('pages/LogInPage.vue') },
      { path: 'signIn', name: 'sign-in', component: () => import('pages/SignInPage.vue') }
    ]
  },
  {
    path: '/app/:serverId(\\d+)?/:chatId(\\d+)?',
    component: () => import('layouts/UserModeLayout.vue'),
    name: "app",
    meta: { requiresAuth: true },
    children: [
      //
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
