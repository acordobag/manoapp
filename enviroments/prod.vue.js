'use strict'

let ip = window.location.hostname

export default {
  NODE_ENV: 'development',
  APP_PATH: `http://${ip}`,
  API_URL: `http://${ip}/api`,
  SOCKET_URL: `http://${ip}`,
  PORT: '80'
}
