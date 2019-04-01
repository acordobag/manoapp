'use strict'

import Subsctiption from '../models/Subscription'
import User from '../models/User'

async function paid (req, res, next) {
  let {_id} = req.headers
  let {hash} = req.body

  try {
    let subscription = await Subsctiption.find({where: {hash}})
    subscription.status = 'paid'
    subscription.paid = true
    subscription.paidAt = Date.now()

    subscription.save()

    res.status(200).send({_id, subscription}).end()
  } catch (e) {
    console.log(e)
    next()    
  }
}

async function confirm (req, res, next) {
  let {hash} = req.body
  // TODO: PASAR ESTO A JOI VALIDATION
  if (!hash) return res.status(500).send({error: 'Missing Parameters for request'}).end()

  try {
    let subscription = await Subsctiption.find({where: {hash}})
    // let user = await
    //Primero chequear si tiene otras suscripciones o si es la primera
    let othersSubscriptions = await Subsctiption.findOtherSubscriptions(subscription.payerId, hash)

    if (!othersSubscriptions.length) {

    }

    subscription.status = 'confirmed'
    subscription.confirmed = true
    subscription.confirmedAt = Date.now()

    // Check payer status to upgrade to passit

    // subscription.save()
    res.status(200).send({subscription, othersSubscriptions}).end()
    //res.status(200).send({_id, subscription, othersSubscriptions}).end()
  } catch (error) {
    next()    
  }
}

export default {
  paid,
  confirm
}