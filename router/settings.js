'use strict'

import express from 'express'
import SettingsController from '../controllers/Settings'
import {verifyToken} from '../helpers/auth'

const settings = express.Router()

settings.patch('/', verifyToken, SettingsController.update)

module.exports = settings
