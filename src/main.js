'use strict'
//                ___ __  __ ____   ___  ____ _____ ____
//  _____ _____  |_ _|  \/  |  _ \ / _ \|  _ |_   _/ ___|   _____ _____
// |_____|_____|  | || |\/| | |_) | | | | |_) || | \___ \  |_____|_____|
// |_____|_____|  | || |  | |  __/| |_| |  _ < | |  ___) | |_____|_____|
//               |___|_|  |_|_|    \___/|_| \_\|_| |____/

import Vue from 'vue'
import App from '@/App.vue'
import config from '@root/config/vue'
import alertify from 'alertify.js'
import Croppa from 'vue-croppa'
import flatPickr from 'vue-flatpickr-component'
import router from '@/router'
import store from '@/store'
import iziToast from 'izitoast'
import vueFb from '@/plugins/fbsdk.js'


import 'flatpickr/dist/flatpickr.css'
import '../node_modules/izitoast/dist/css/iziToast.min.css'
//                _____ ___ _   _____ _____ ____  ____
//  _____ _____  |  ___|_ _| | |_   _| ____|  _ \/ ___|   _____ _____
// |_____|_____| | |_   | || |   | | |  _| | |_) \___ \  |_____|_____|
// |_____|_____| |  _|  | || |___| | | |___|  _ < ___) | |_____|_____|
//               |_|   |___|_____|_| |_____|_| \_|____/

import moneyFormat from '@/filters/moneyFormat'
import dateFormat from '@/filters/dateFormat'
import capitalize from '@/filters/capitalize'
import profileImage from '@/directives/profile-image'
//                ____  _    _   _  ____ ___ _   _ ____
//  _____ _____  |  _ \| |  | | | |/ ___|_ _| \ | / ___|   _____ _____
// |_____|_____| | |_) | |  | | | | |  _ | ||  \| \___ \  |_____|_____|
// |_____|_____| |  __/| |__| |_| | |_| || || |\  |___) | |_____|_____|
//               |_|   |_____\___/ \____|___|_| \_|____/
Vue.directive('profile-image', profileImage)
Vue.use(moneyFormat)
Vue.use(dateFormat)
Vue.use(capitalize)
Vue.use(flatPickr)
Vue.use(Croppa)


Vue.use(vueFb, {
  appId: config.FB_ID,
  cookie: true,
  xfbml: true,
  version: 'v3.0'
})

iziToast.settings({
  timeout: 5000,
  position: 'topRight',
  theme: 'dark',
  displayMode: 1
})


Vue.component('cLoader', () => import('@/components/loaders/contentLoader.vue'))
Vue.component('backClock', () => import('@/components/commons/Clock.vue'))
Vue.component('PopWindow', () => import('@/components/commons/PopWindow.vue'))

Vue.prototype.$iziToast = iziToast
Vue.prototype.$alertify = alertify
window.$ = require('jquery')
window.jQuery = require('jquery')

//               __     ___   _ _____   ___ _   _ ___ _____
//  _____ _____  \ \   / | | | | ____| |_ _| \ | |_ _|_   _|  _____ _____
// |_____|_____|  \ \ / /| | | |  _|    | ||  \| || |  | |   |_____|_____|
// |_____|_____|   \ V / | |_| | |___   | || |\  || |  | |   |_____|_____|
//                  \_/   \___/|_____| |___|_| \_|___| |_|

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  mounted () {
    let locations = window.location
    if (config.NODE_ENV === 'production' && locations.protocol !== 'https:') {
      let href = locations.href
      href = href.replace('http:', 'https:')
      window.location = href
    }

    if (window.localStorage.token) {
      store.dispatch('user/setSocket', JSON.parse(window.localStorage.user))
    }
  },
  router,
  store
})
