'use strict'

let ip = window.location.hostname

export default {
  NODE_ENV: 'development',
  APP_PATH: `http://${ip}:8080`,
  API_URL: `http://${ip}:3000/api`,
  SOCKET_URL: `http://${ip}:3000`,
  PORT: '8080',
  FB_ID: '',
  FB_SECRET: '',
  FB_ACCESS_TOKEN: ''
}
