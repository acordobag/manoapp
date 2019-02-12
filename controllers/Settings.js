'use strict'

// import Setting from '../models/Setting'
import {socketEmit} from '../helpers/sockets'

async function update (req, res, next) {
  let {_id: userId} = req.headers
  let {field, value} = req.body

  try {
    let query = {}
    query[field] = value
    await Setting.update(query, {where: {userId}})
    socketEmit('update/user', userId)

    res.status(200).send({status: true}).end()
  } catch (e) {
    next(e)
  }
}

export default {
  update
}
