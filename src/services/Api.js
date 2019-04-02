'use strict'

import alertify from 'alertify.js'
import trae from 'trae'
import config from '@root/config/vue'
import store from '@/store'

trae.baseUrl(config.API_URL)

const setHeaders = (cnf) => {
  store.dispatch('app/isLoading', true)
  const token = window.localStorage.token
  if (token) cnf.headers['Authorization'] = token
  return cnf
}

const fullfillMiddleware = (res) => {
  store.dispatch('app/isLoading', false)
  return res
}

const rejectMiddleware = (err) => {
  store.dispatch('app/isLoading', false)
  if (err.data && err.data.authorization === 'invalidToken') {
    store.dispatch('app/isAuth', false)
  } else if(err.data && err.data.error){
    alertify.error('Error '+ err.data.error)
  }/*else{
    alertify.error('Ocurrió un error inesperado, por favor contacte a su administrador.')
  }*/
  return Promise.reject(err)
}

trae.before(setHeaders)
trae.after(fullfillMiddleware, rejectMiddleware)

export default trae
