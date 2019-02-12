'use strict'

import Api from '@/services/Api'

export default {
  pending: () => Api.get('/subscriptions/pending'),
  detail: hash => Api.get(`/subscriptions/pending/${hash}`),
  paid: data => Api.patch('/subscriptions/paid', data),
  confirm: data => Api.patch('/subscriptions/confirm', data),
  // PENDINGS ADMIN
  pendingsAdmin: () => Api.get('/subscriptions/admin/pending')
}
