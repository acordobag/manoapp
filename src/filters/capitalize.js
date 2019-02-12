const capitalize = {}

function textToCapitalize (value) {
  if (!value) return ''
  value = value.toString().toLowerCase()
  value = value.split(' ')
  if (value.length >= 1) {
    var name = []
    value.map(el => {
      el = el.charAt(0).toUpperCase() + el.slice(1)
      name.push(el)
    })
  }

  return name.join(' ')
}

capitalize.install = function (Vue) {
  Vue.filter('capitalize', (val) => {
    return textToCapitalize(val)
  })
}

export default capitalize
