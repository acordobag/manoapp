'use strict'

import Api from '@/services/Api'

export default {
  get: (membershipId) => Api.get(`/annex/${membershipId}`),
  activate: (membership) => Api.post('/annex/create', membership),
  detail: (hash, id) => Api.get(`/annex/detail/${hash}/${id}`),
}