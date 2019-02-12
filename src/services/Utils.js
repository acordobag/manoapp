'use strict'

import Api from '@/services/Api'

function getCountries () {
  return Api.get('/countries')
}

export default {
  getCountries
}
