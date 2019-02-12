'use strict'

import express from 'express'
import NotificationsController from '../controllers/Notifications'
import {verifyToken} from '../helpers/auth'

const notifications = express.Router()

notifications.get('/', verifyToken, NotificationsController.getNotifications)
notifications.patch('/', verifyToken, NotificationsController.markAsRead)

module.exports = notifications
