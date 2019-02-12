'use strict'

import Documents from '../models/Documents'

async function getAll (req, res, next) {
  try {
    let data = await Documents.findAll()

    res.status(200).send(data).end()
  } catch (e) {
    next(e)
  }
}

async function count (req, res, next) {
	try {
    let data = await Documents.findAll()

    res.status(200).send({count: data.length}).end()
  } catch (e) {
    next(e)
  }
}

export default {
  getAll,
  count
}
