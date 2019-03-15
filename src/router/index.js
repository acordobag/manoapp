'use strict'

import Vue from 'vue'
import VueRouter from 'vue-router'
import app from '@/router/app'
import store from '@/store/index'

const routes = [
  {
    path: '/',
    component: () => import('@/components/layouts/Main.vue'),
    meta: { isPublic: true },
    children: [
      {
        path: '/',
        alias: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
        meta: { isPublic: true }
      },
      {
        path: '/disclaimer',
        name: 'disclaimer',
        component: () => import('@/views/Disclaimer.vue'),
        meta: { isPublic: true }
      },
      {
        path: '/cookies',
        name: 'cookies',
        component: () => import('@/views/Cookies.vue'),
        meta: { isPublic: true }
      },
      {
        path: '/privacy',
        name: 'privacy',
        component: () => import('@/views/Privacy.vue'),
        meta: { isPublic: true }
      }
    ]
  },
  ...app,
  {
    path: '/*',
    name: 'errorpage',
    component: () => import('@/views/Error.vue')
  }
]

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: 'history'
})

//                 ____             _          ____                     _
//                |  _ \ ___  _   _| |_ ___   / ___|_   _  __ _ _ __ __| |___
//   _____ _____  | |_) / _ \| | | | __/ _ \ | |  _| | | |/ _` | '__/ _` / __|
//  |_____|_____| |  _ | (_) | |_| | ||  __/ | |_| | |_| | (_| | | | (_| \__ \
//                |_| \_\___/ \__,_|\__\___|  \____|\__,_|\__,_|_|  \__,_|___/

function isAuthorized() {
  let { localStorage } = window
  let { user, token, selectedAccount } = localStorage

  let isAuth = false
  let isStaff = false
  let active = false

  if (token && user && selectedAccount) {
    // If user exist store user in vuex
    user = JSON.parse(user)
    selectedAccount = JSON.parse(selectedAccount)
    active = selectedAccount.status !== 'created'
    isAuth = true
    isStaff = user.permissions !== 'user'

    store.dispatch('app/isAuth', isAuth)
    store.dispatch('user/setUser', user)
    store.dispatch('user/setSelectedAccount', selectedAccount)
  }

  return {
    user,
    selectedAccount,
    token,
    active,
    isAuth,
    isStaff
  }
}

router.beforeEach((to, from, next) => {
  let { isAuth, isStaff, user, active } = isAuthorized()
  let { isPublic, staffOnly } = to.meta

  if (!isAuth && !isPublic) {
    return next('/login')
  }

  if (isAuth && !active && to.name !== 'activate' && to.name !== 'logout') {
    return next({ path: `/${user.username}/activate` })
  }

  if (isAuth && active && to.name === 'activate') {
    return next({ path: `/${user.username}` })
  }

  if (to.name === 'login' && isAuth) {
    return next({ path: `/${user.username}` })
  }

  if (isAuth && staffOnly && !isStaff) {
    return next({ path: `/${user.username}` })
  }

  next()
})

export default router