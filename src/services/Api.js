'use strict'

import trae from 'trae'
import config from '@root/config/vue'
import store from '@/store'

trae.baseUrl(config.API_URL)

const setHeaders = (cnf) => {
  const token = window.localStorage.token
  if (token) cnf.headers['Authorization'] = token
  return cnf
}

const fullfillMiddleware = res => res

const rejectMiddleware = (err) => {
  if (err.data && err.data.authorization === 'invalidToken') {
    store.dispatch('app/isAuth', false)
  }
  return Promise.reject(err)
}

trae.before(setHeaders)
trae.after(fullfillMiddleware, rejectMiddleware)

export default trae
