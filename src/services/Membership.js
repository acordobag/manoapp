'use strict'

import Api from '@/services/Api'

export default {
  userAccounts: () => Api.get('/membership'),
  getLinks: () => Api.get('/membership/links'),
  confirm: (data) =>  Api.post('/membership/confirm', data),
  findById: (id) =>  Api.post(`/membership/${id}`)
}