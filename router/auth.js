'use strict'

import express from 'express'
import AuthController from '../controllers/Auth'
import {verifyToken} from '../helpers/auth'

const auth = express.Router()

// Nexmo
auth.post('/code/send', AuthController.sendVerificationCode)
auth.post('/code/verify', verifyToken, AuthController.verifyCode)
auth.get('/token', verifyToken, (req, res) => {
  res.status(200).send({valid: true}).end()
})

module.exports = auth

