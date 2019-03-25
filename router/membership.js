'use strict'

import express from 'express'
import MembershipController from '../controllers/Membership'

import {verifyToken} from '../helpers/auth'

const Membership = express.Router()

Membership.get('/', verifyToken, MembershipController.getAllByUserId)
Membership.get('/find/:id', verifyToken, MembershipController.findById)
Membership.get('/giver-state', verifyToken, MembershipController.getGiverAccountsByUserId)
Membership.get('/links', verifyToken, MembershipController.getLinks)
Membership.post('/confirm', verifyToken, MembershipController.confirmMembership)
// Membership.get('/benefits', verifyToken, MembershipController.getBenefits)

// Membership.post('/initialize', verifyToken, MembershipController.initializeProgress)

// Membership.patch('/paid', verifyToken, MembershipController.paid)
// Membership.patch('/confirm', verifyToken, MembershipController.confirm)

module.exports = Membership