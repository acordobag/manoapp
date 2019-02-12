'use strict'

import Api from '@/services/Api'

export default {
  get: (offset, limit) => Api.get(`/news?o=${offset}&l=${limit}`),
  detail: newId => Api.get(`/news/${newId}`)
}
