'use strict'

export function getEstructure (coordinates) {
  let levels =  coordinates.split(';')
  let estructure = []
  
  for (let i = 0; i < levels.length; i++) {
    const el = levels[i]
  
    let legacies = el.split(',')
    let toRecibe = 0
    let toPay = 0
    let subscription = 0
  
    legacies.map(el => {
      if (el === 'r') {
        toRecibe = ++toRecibe
      }
      if (el === 'p') {
        toPay = ++toPay
      }
      if (el === 's') {
        subscription = ++ subscription
      }
    })

    estructure.push({toRecibe, toPay, subscription})
  }

  return estructure
}
