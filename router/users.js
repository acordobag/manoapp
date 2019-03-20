'use strict'

import express from 'express'
import UserController from '../controllers/User'
import {validateBody, validateParam, schemas} from '../helpers/validation'
import {verifyToken} from '../helpers/auth'
import {check} from '../helpers/permissions'

const users = express.Router()

users.get('/', verifyToken, UserController.data)
users.get('/links/:membershipId', verifyToken, UserController.getLinks)
users.get('/check/:username', validateParam(schemas.user.username, 'username'), verifyToken, UserController.check)
users.post('/auth', validateBody(schemas.user.login), UserController.auth)
users.post('/create', verifyToken, UserController.create)
users.patch('/username', verifyToken, UserController.changeUsername)
users.patch('/confirm/:membershipId', verifyToken, UserController.confirmAccount)

// contacts
users.post('/contact', verifyToken, UserController.addContact)
users.delete('/contact/:id', verifyToken, UserController.deleteContact)

// Admin Routes
users.get('/list', verifyToken, check('admin'), UserController.getAll)
users.get('/:userId', verifyToken, check('admin'), UserController.getData)

users.patch('/password', verifyToken, UserController.changePassword)
users.patch('/password/reset', verifyToken, check('admin'), UserController.resetPassword)

module.exports = users