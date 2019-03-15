'use strict'

import Api from '@/services/Api'

export default {
  initialize: (data) => Api.post('/legacies/initialize', data),
  pending: (memershipId) => Api.get(`/legacies/pending/${memershipId}`),
  detail: (hash, id) => Api.get(`/legacies/${hash}/${id}`),
  paid: (data) => Api.patch(`/legacies/paid`, data),
  benefits: () => Api.get(`/legacies/benefits`),
  nulls: () => Api.get(`/legacies/nulls`),
  confirm: (data) => Api.patch(`/legacies/confirm`, data)
}