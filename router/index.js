'use strict'

import express from 'express'
import fs from 'fs'
import path from 'path'
const api = express.Router()

fs.readdirSync(__dirname).forEach(el => {
  if (el === 'index.js') return

  let file = path.join(__dirname, el)
  let name = el.split('.')[0]
  name = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

  let route = require(file)

  api.use(`/${name}`, route)
})

// Error Handler
api.use('/*', (req, res) => {
  res.status(404).send({status: 404, message: 'Bad request, URL not Found'})
})

api.use('/*/*', (req, res) => {
  res.status(404).send({status: 404, message: 'Bad request, URL not Found'})
})

export default api
