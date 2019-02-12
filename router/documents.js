'use strict'

import express from 'express'
import DocumentsController from '../controllers/Documents'
import {verifyToken} from '../helpers/auth'

const documents = express.Router()

documents.get('/', verifyToken, DocumentsController.getAll)
documents.get('/count', verifyToken, DocumentsController.count)

module.exports = documents
