'use strict'

import express from 'express'
import SubscriptionController from '../controllers/Subscription'

import {verifyToken} from '../helpers/auth'
import {check} from '../helpers/permissions'

const subscriptions = express.Router()

subscriptions.get('/pending', verifyToken, SubscriptionController.getPending)
subscriptions.get('/pending/:hash', verifyToken, SubscriptionController.detail)
subscriptions.patch('/paid', verifyToken, SubscriptionController.paid)
// ADMIN ROUTES
subscriptions.get('/admin/pending', verifyToken, check('admin'), SubscriptionController.allPendings)
subscriptions.patch('/confirm', verifyToken, check('admin'), SubscriptionController.confirm)

module.exports = subscriptions
