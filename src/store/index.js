'use strict'

import Vue from 'vue'
import Vuex from 'vuex'

// Store Modules
import app from './modules/app'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    app
  }
})
