'use strict'

import _ from 'lodash'

export function groupArray (array, by = 'hash', items = ['hash', 'contracts']) {
  return _.chain(array)
      .groupBy(by)
      .toPairs()
      .map(function(currentItem) {
          return _.zipObject(items, currentItem);
      })
      .value()
}
