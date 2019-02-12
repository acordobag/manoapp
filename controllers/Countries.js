'use strict'

// MODELS
import CountryModel from '../models/Country'

async function getCountries (req, res, next) {
  try {
    let countries = await CountryModel.findAll()
    res.status(200).send(countries).end()
  } catch (e) {
    next(e)
  }
}

export default {
  getCountries
}
