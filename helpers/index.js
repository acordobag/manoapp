'use strict'

function apiResponse (res, status = 500, messageId = 5, message = 'Error de Inesperado') {
  res.status(status).send({
    resultCode: messageId,
    message: message
  })
}

function capitalize (value) {
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

module.exports = {
  apiResponse,
  capitalize
}
