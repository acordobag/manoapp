'use strict'

import Api from '@/services/Api'

export default {
  send: data => Api.post('/auth/code/send', data),
  verify: data => Api.post('/auth/code/verify', data),
  token: () => Api.get('/auth/token')
}
