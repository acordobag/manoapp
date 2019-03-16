'use strict'

import Api from '@/services/Api'

export default {
  initialize: (data) => Api.post('/legacies/initialize', data),
  pending: (memershipId) => Api.get(`/legacies/pending/${memershipId}`),
  detail: (hash, id) => Api.get(`/legacies/${hash}/${id}`),
  paid: (data) => Api.patch(`/legacies/paid`, data),
  benefits: (memershipId) => Api.get(`/legacies/benefits/${memershipId}`),
  nulls: (memershipId) => Api.get(`/legacies/nulls/${memershipId}`),
  confirm: (data) => Api.patch(`/legacies/confirm`, data)
}