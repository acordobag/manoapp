'use strict'

import express from 'express'
import AnnexController from '../controllers/Annex'
import {verifyToken} from '../helpers/auth'

const annex = express.Router()

annex.get('/:membershipId', verifyToken, AnnexController.getAnnexes)
annex.get('/detail/:hash/:id', verifyToken, AnnexController.detail)
annex.post('/create', verifyToken, AnnexController.createAnnex)


// TEST ROUTES
annex.post('/create/legacies', verifyToken, AnnexController.test)

module.exports = annex