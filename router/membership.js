'use strict'

import express from 'express'
import MembershipController from '../controllers/Membership'

import {verifyToken} from '../helpers/auth'

const Membership = express.Router()

Membership.get('/', verifyToken, MembershipController.getByUserId)
Membership.get('/links', verifyToken, MembershipController.getLinks)
// Membership.get('/benefits', verifyToken, MembershipController.getBenefits)

// Membership.post('/initialize', verifyToken, MembershipController.initializeProgress)

// Membership.patch('/paid', verifyToken, MembershipController.paid)
// Membership.patch('/confirm', verifyToken, MembershipController.confirm)

module.exports = Membership