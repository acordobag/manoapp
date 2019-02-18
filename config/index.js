'use strict'

let os = require('os')
let ifaces = os.networkInterfaces()

let ip
let ips = []

Object.keys(ifaces).forEach(function (ifname) {
  ifaces[ifname].forEach(function (iface) {
    if (iface.family !== 'IPv4' || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return
    }
    ips.push(iface.address)
  })
})

ip = ips[0]

let port = 80

const fs = require('fs')
const path = require('path')

export default {
  enviroment: 'production',
  port: port || 'localhost',
  host: ip,
  clientUrl: `http://${ip}:${port}`,
  authentication: {
    jwtSecret: 'replaceAppSecretKey'
  },
  paypalSettings: {
    clientId: 'AfFR8hQDzVoBv3n-q_Lt2JLahD3zmKqWuXgfWNcaW3TLmSE4hGQM3JEbdNVE7oEcjtj82O_kJDb3ftlC',
    secret: 'EGbZyKr62AnlLmdzcL6GgvfcE6joEAVKkZ3CoQ5J_ByuqDSO1KxIEkvzLwQJ8C_AN-EM2umx-5J92EC6',
    enviroment: 'sandbox'
  },
  mailSettings: {
    user: 'kperaza ',
    pass: 'ProyectoMano2019'
  },
  smsSettings: {
    key: '485baa88',
    secret: 'vGx3CH2lwVQ694yH'
  },
  moneyGram: {
    endpoint: 'http://186.15.1.196:1492/SWMP/Monster?wsdl',
    user: 'SWMP',
    password: 'S45W21M89P'
  },
  payments: {
    key: "pk_test_SSc1HQD04OGEMWjzFCGDmHn1",
    secret: "sk_test_lfl2WsKiu4tZaIsgZlxw3a8q"
  },
  dbSettings: {
    host: '40.122.170.216',
    username: 'acordoba',
    password: 'acordoba',
    database: 'manoapp',
    dialect: 'mysql',
    // timezone: 'America/Costa_Rica',
    logging: msg => {
      fs.appendFile(path.join(__dirname, '../db', 'log.log'), msg, (err) => {
        if (err) {
          return console.log(err)
        }
      })
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: false
  }
}
