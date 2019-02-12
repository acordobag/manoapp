'use strict'

import Api from '@/services/Api'

export default {
  get: () => Api.get(`/documents`)
}
