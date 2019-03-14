'use strict'

import express from 'express'
import LegaciesController from '../controllers/Legacies'

import {verifyToken} from '../helpers/auth'

const legacies = express.Router()

legacies.get('/pending/:membershipId', verifyToken, LegaciesController.getPending)
legacies.get('/benefits', verifyToken, LegaciesController.getBenefits)
legacies.get('/nulls', verifyToken, LegaciesController.findNullByUser)
legacies.get('/:hash/:id', verifyToken, LegaciesController.getDetail)
legacies.post('/assign', verifyToken, LegaciesController.assignInLegacy)

legacies.post('/initialize', verifyToken, LegaciesController.initializeProgress)

legacies.patch('/paid', verifyToken, LegaciesController.paid)
legacies.patch('/confirm', verifyToken, LegaciesController.confirm)

module.exports = legacies