'use strict'

import {version} from '../../../package.json'
import moment from 'moment'

const state = {
  isLoading: false,
  version: version,
  isAuth: false,
  newVersion: false,
  showNewPayment: false,
  showInviteFriend: false,
  showEditPersonalData: false,
  date: moment().format('YYYY')
}

const mutations = {
  sIsLoading (state, bool) {
    state.isLoading = bool
  },
  switchNewPayment (state) {
    state.showNewPayment = !state.showNewPayment
  },
  switchInviteFriend (state) {
    state.showInviteFriend = !state.showInviteFriend
  },
  switchEditPersonalData (state) {
    state.showEditPersonalData = !state.showEditPersonalData
  },
  isAuth (state, bool) {
    state.isAuth = bool
  },
  newVersion (state, bool) {
    state.newVersion = bool
  }
}

const actions = {
  isAuth ({commit}, data) {
    commit('isAuth', data)
  },
  isLoading ({commit}, data) {
    commit('sIsLoading', data)
  },
  newVersion ({commit}, bool) {
    commit('newVersion', bool)
  }
}

const getters = {
  isAuth: state => state.isAuth,
  newVersion: state => state.newVersion
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
