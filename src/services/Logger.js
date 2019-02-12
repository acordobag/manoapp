'use strict'
import Api from '@/services/Api'

function newError (data) {
  return Api.post('/logger/error', data)
}

export default {
  newError
}
