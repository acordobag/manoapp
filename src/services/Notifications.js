'use strict'
import Api from '@/services/Api'

export default {
  get: () => Api.get('/notifications'),
  read: data => Api.patch('/notifications', data)
}
