'use strict'

let ip = window.location.hostname

export default {
  NODE_ENV: 'development',
  APP_PATH: `http://${ip}:8080`,
  API_URL: `http://${ip}:3000/api`,
  SOCKET_URL: `http://${ip}:3000`,
  PORT: '8080',
  FB_ID: '473858762977700',
  FB_SECRET: 'd899643eb5ff3620f7b79def55eed7a1',
  FB_ACCESS_TOKEN: '473858762977700|Nc4JmdTEFonqm-3go4Etvh7Oauc',
  STRIPE_KEY: "pk_test_SSc1HQD04OGEMWjzFCGDmHn1"
}
