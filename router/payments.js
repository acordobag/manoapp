'use strict'

import express from 'express'
import PaymentsController from '../controllers/Payments'
import {verifyToken} from '../helpers/auth'

const payments = express.Router()


payments.patch('/subscription', verifyToken, PaymentsController.paid)

module.exports = payments