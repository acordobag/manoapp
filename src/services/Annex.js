'use strict'

import Api from '@/services/Api'

export default {
  get: () => Api.get('/annex'),
  activate: () => Api.post('/annex/create'),
  detail: (hash, id) => Api.get(`/annex/detail/${hash}/${id}`),
}