'use strict'

import config from '@root/config/vue'
import moment from 'moment'
import io from 'socket.io-client'

const state = {
  userData: {},
  socket: {}
}

const mutations = {
  setUser (state, user) {
    state.userData = user
  },
  setSocket (state, socket) {
    state.socket = socket
  },
  unsetSocket (state) {
    state.socket.close()
    state.socket = {}
  }
}

const actions = {
  setUser ({commit}, user) {
    commit('setUser', user)
  },
  unsetSocket({commit}) {
    commit('unsetSocket')
  },
  setSocket ({commit}, data) {
    let url = (data.permissions !== 'user') ? `${config.SOCKET_URL}/staff` : `${config.SOCKET_URL}/clients`
    let socket = io(url, {
      query: {
        _id: data.id,
        name: data.fullName,
        isStaff: data.permissions !== 'user',
        isAdmin: data.permissions === 'admin' || data.permissions === 'superAdmin',
        enviroment: config.NODE_ENV,
        connectedSince: moment().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    commit('setSocket', socket)
  }
}

const getters = {
  userData: (state) => state.userData,
  socket: (state) => state.socket
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
