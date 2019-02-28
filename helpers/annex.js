'use strict'

export function getEstructure(coordinates) {
  let estructure = []
  let toRecibe = 0
  let toPay = 0
  let subscription = 0
  if (coordinates === '*') {
    for (let i = 0; i < 20; i++) {
      toRecibe++;
    }
    estructure.push({ toRecibe, toPay, subscription })
  } else {
    let levels = coordinates.split(';')
    
    for (let i = 0; i < levels.length; i++) {
      const el = levels[i]

      toRecibe = 0
      toPay = 0
      subscription = 0

      let legacies = el.split(',')

      legacies.map(el => {
        if (el === 'r') {
          toRecibe = ++toRecibe
        }
        if (el === 'p') {
          toPay = ++toPay
        }
        if (el === 's') {
          subscription = ++subscription
        }
      })

      estructure.push({ toRecibe, toPay, subscription })
    }
  }
  return estructure
}
