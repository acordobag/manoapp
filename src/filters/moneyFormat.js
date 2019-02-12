let moneyFormat = {}

function toMoneyFormat (value) {
  if (!value) {
    return `$0.00`
  }
  value = value * 1
  let int = parseInt(value)
  let result

  if (!isNaN(int)) {
    if (int < 0) {
      result = `-$${Math.abs(value).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`
    } else {
      result = `$${value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`
    }
  } else {
    result = 'invalid number'
  }

  return result
}


function toDecimals (value) {
  if (!value) {
    return `0.00`
  }

  value = value * 1
  let int = parseInt(value)
  let result

  if (!isNaN(int)) {
    result = value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
  } else {
    result = 'invalid number'
  }

  return result
}

moneyFormat.install = (Vue) => {
  Vue.filter('moneyFormat', val => {
    return toMoneyFormat(val)
  })
  Vue.filter('decimalFormat', val => {
    return toDecimals(val)
  })
}

export default moneyFormat
