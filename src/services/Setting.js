'use strict'
import Api from '@/services/Api'

export default {
  update: data => Api.patch('/settings', data)
}
