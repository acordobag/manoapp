'use strict'

import express from 'express'
import CountriesController from '../controllers/Countries'

const countries = express.Router()

countries.get('/', CountriesController.getCountries)

module.exports = countries