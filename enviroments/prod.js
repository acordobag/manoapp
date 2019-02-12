'use strict'

let port = process.env.PORT

const fs = require('fs')
const path = require('path')

module.exports = {
  enviroment: process.env.NODE_ENV,
  port: port,
  host: process.env.HOST,
  clientUrl: process.env.CLIENT_URL,
  authentication: {
    jwtSecret: process.env.SECRET_KEY
  },
  paypalSettings: {
    clientId: process.env.PAYPAL_CLIENT_ID,
    secret: process.env.PAYPAL_SECRET,
    enviroment: process.env.PAYPAL_ENVIROMENT
  },
  mailSettings: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASS
  },
  smsSettings: {
    key: process.env.NEXMO_API_KEY,
    secret: process.env.NEXMO_API_SECRET
  },
  moneyGram: {
    endpoint: process.env.MONEYGRAM_API,
    user: process.env.MONEYGRAM_USER,
    password: process.env.MONEYGRAM_PASSWORD
  },
  dbSettings: {
    host: process.env.SQL_HOST,
    username: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
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
    // // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
  }
}
