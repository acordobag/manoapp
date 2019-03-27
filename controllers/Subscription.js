'use strict'

import Subscription from '../models/Subscription'
import Legacies from '../models/Legacies'
import Membership from '../models/Membership'
import { socketEmit } from '../helpers/sockets'
import uniqid from 'uniqid'

async function getPending(req, res, next) {
  let { membership } = req.params
  console.log(membership)
  try {
    let subscriptions = await Subscription.findPendingSubscriptions(membership)

    res.status(200).send(subscriptions).end()
  } catch (e) {
    console.log(e)
    next(e)
  }
}

async function detail(req, res, next) {
  let { _id } = req.headers
  let { hash } = req.params

  try {
    let subscription = await Subscription.find({
      where: {
        hash
      }
    })

    res.status(200).send(subscription).end()
  } catch (e) {
    next(e)
  }
}

async function paid(req, res, next) {
  let { _id } = req.headers
  let { hash } = req.body


  try {
    let subscription = await Subscription.findByHash(hash)
    subscription.status = 'paid'
    subscription.paid = true
    subscription.paidAt = Date.now()

    subscription.save()

    socketEmit('update/subscription', subscription.membership.owner.id)
    socketEmit('update/user', subscription.membership.owner.id)

    res.status(200).send({ _id, subscription }).end()
  } catch (e) {
    console.log(e)
    next()
  }
}

async function confirm(req, res, next) {
  let { hash } = req.body
  // TODO: PASAR ESTO A JOI VALIDATION
  if (!hash) return res.status(500).send({ error: 'Missing Parameters for request' }).end()

  try {
    let subscription = await Subscription.findByHash(hash);

    if (!subscription) return res.status(500).send({ error: 'Not found' }).end()

    // let user = await
    // Primero chequear si tiene otras suscripciones o si es la primera
    let othersSubscriptions = await Subscription.findOtherSubscriptions(subscription.payerMembershipId, hash)
    let pendingLegacies = await Legacies.findPendingLegacies(subscription.payerMembershipId)

    if (pendingLegacies.length) return res.status(500).send({ error: 'Tiene legados pendientes' }).end()

    subscription.status = 'confirmed'
    subscription.confirmed = true
    subscription.confirmedAt = Date.now()

    if (!othersSubscriptions.length) {
      let membership = await Membership.findById(subscription.payerMembershipId)
      if (membership.status === 'confirmed') {
        membership.status = 'subscriber'
        await membership.save()
      }
    }

    // SOCKETS AND NOTIFICATIONS
    // UPDATE USER STATUS SOCKET update/user
    socketEmit('update/user', subscription.membership.owner.id)
    socketEmit('update/subscription', subscription.membership.id)

    subscription.save()

    res.status(200).send({ subscription, othersSubscriptions }).end()
  } catch (error) {
    console.log(error)
    next()
  }
}

async function allPendings(req, res, next) {
  try {
    let pendings = await Subscription.findAllPendings()

    res.status(200).send(pendings).end()
  } catch (e) {
    console.log(e)
    next(e)
  }
}

async function createSubscription(membershipId) {
  let membership = await Membership.findById(membershipId)
  return await Subscription.create({
    hash: uniqid().toUpperCase(),
    assignedAt: Date.now(),
    payerMembershipId: membership.id,
    amount: membership.type.suscriptionAmount
  })
}

export default {
  detail,
  paid,
  confirm,
  getPending,
  allPendings,
  createSubscription
}