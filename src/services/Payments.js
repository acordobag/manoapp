'use strict'

import Api from '@/services/Api'

export default {
  make: data => Api.patch('/payments/subscription', data)
}