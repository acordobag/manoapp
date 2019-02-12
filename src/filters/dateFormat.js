import moment from 'moment'

moment.locale('es')

let dateFilters = {}

function toExactDate (date) {
  if (!date) {
    return 'Invalid Date'
  }

  let result = moment(date).format('DD/MM/YYYY')

  return result
}

function toExactDateAndTime (date) {
  if (!date) {
    return 'Invalid Date'
  }

  let result = moment(date).format('DD/MM/YYYY h:mm:ss a')

  return result
}

function getMonth (date) {
  if (!date) {
    return 'Invalid Date'
  }

  let result = moment(date).add(6, 'hours').format('MMMM')

  return result.toUpperCase()
}

function getBirthday (birthdayDate) {
  if (!birthdayDate) return 'Cumpleaños desconocido'

  birthdayDate = new Date(birthdayDate)
  birthdayDate.setHours(birthdayDate.getHours())

  let birthDay = new Date(birthdayDate).getDate()
  let birthMonth = new Date(birthdayDate).getMonth() + 1
  let currentYear = new Date().getFullYear()
  let newDate = `${currentYear}-${birthMonth}-${birthDay}`
  let date = new Date(newDate)

  let birthdayFromNow

  if (date < new Date()) {
    birthdayFromNow = moment(date).add(1, 'year').format('ll')
  } else {
    birthdayFromNow = moment(date).fromNow()
  }

  return `🎂 ${birthdayFromNow}`
}

function fromDate (dateFrom) {
  // let date = moment(dateFrom).fromNow()
  let date = moment(dateFrom)
  let today = moment()

  let days = date.diff(today, 'days')

  if (days <= 0) return 'Expirado'

  return `${days} días`
}

function toHuman (timestamp) {
  return moment(timestamp).format('MMMM DD YYYY, h:mm:ss a')
}

dateFilters.install = (Vue) => {
  Vue.filter('exactDate', val => {
    return toExactDate(val)
  })

  Vue.filter('toHuman', val => {
    return toHuman(val)
  })

  Vue.filter('exactDateTime', val => {
    return toExactDateAndTime(val)
  })

  Vue.filter('getMonth', val => {
    return getMonth(val)
  })

  Vue.filter('birthdayDate', val => {
    return getBirthday(val)
  })

  Vue.filter('fromDate', val => {
    return fromDate(val)
  })
}

export default dateFilters
