'use strict'

import Legacies from '../models/Legacies'
import Subscriptions from '../models/Subscription'
import Annex from '../models/Annex'
import User from '../models/User'
import Membership from '../models/Membership'
import SetOfLegacies from '../models/SetOfLegacies'
import UserControler from './User'

import SubscriptionController from '../controllers/Subscription'
import AnnexController from '../controllers/Annex'
import { socketEmit } from '../helpers/sockets'

//deprecated
async function assignInLegacy(req, res, next) {
  let { _id } = req.headers

  try {
    let save = await _assignInLegacy(_id)
    res.status(200).send(save).end()
  } catch (e) {
    next(e)
  }
}

async function getPending(req, res, next) {
  let { _id } = req.headers
  let { membershipId } = req.params

  try {

    let pendingLegacies = await Legacies.findPendingLegacies(membershipId)
    res.status(200).send(pendingLegacies).end()

  } catch (e) {
    next(e)
  }
}

async function getDetail(req, res, next) {
  let { _id } = req.headers
  let { hash, id } = req.params

  try {
    let detail = await Legacies.findDetailByHash(hash, id)

    res.status(200).send(detail).end()
  } catch (e) {
    next(e)
  }
}

async function getBenefits(req, res, next) {
  let { _id } = req.headers
  let { membershipId } = req.params
  try {
    let annexes = await Annex.findByMembershipId(membershipId)
    let legacies = []
    let benefits = 0

    annexes.map(el => {
      legacies = [...legacies, ...el.legacies]
    })

    legacies.map(el => {
      if (el.status === 'confirmed') {
        benefits = benefits + 20
      }
    })

    res.status(200).send({ benefits }).end()
  } catch (e) {
    console.log(e)
    next(e)
  }
}

async function initializeProgress(req, res, next) {
  let { id } = req.body

  try {
    // Chequear que el estado del usuario sea Suscriber para poder ponerle los 2 primero legados
    let membership = await Membership.findById(id)
    let result = {}

    // Chequear que no tenga otros asignados
    let otherLegacies = await SetOfLegacies.findActive(id)

    if (otherLegacies) return res.status(500).send({ error: 'user have other legacies' }).end()

    if (membership.status = 'subscriber') {
      await createNewLegaciesSet(id, 2, false)
    }

    res.status(200).send(result).end()
  } catch (e) {
    console.log(e)
    next(e)
  }
}

async function _assignInLegacy(membershipId) {
  try {

    let membership = await Membership.findById(membershipId)

    let legacyData = await _findRandomLegacy(membership.type.annexTypeId)
    //if(!legacyData) return null;
    let legacy = await Legacies.find({ where: { id: legacyData.id } })

    legacy.assignedAt = Date.now()
    legacy.payerMembershipId = membershipId
    legacy.status = 'pending'

    //Notificar y Sockets

    let data = await legacy.save()

    return data
  } catch (e) {
    console.log('Error on assign legacies\n' + e)
    return { error: e }
  }
}

async function _findRandomLegacy(annexType = 1) {
  let annexes = await Annex.findByType(annexType)
  let emptyLegacy
  let attemps = 0

  while (!emptyLegacy && attemps < annexes.length) {
    let randNumber = Math.floor(Math.random() * annexes.length)
    emptyLegacy = annexes[randNumber].legacies[0]
    ++attemps
  }

  // if (!emptyLegacy) {
  //   attemps = 0
  //   annexes = await Annex.findByType(2)

  //   while (!emptyLegacy && attemps < annexes.length) {
  //     let randNumber = Math.floor(Math.random() * annexes.length)
  //     emptyLegacy = annexes[randNumber].legacies[0]
  //     ++attemps
  //   }
  // }

  return emptyLegacy
}

async function paid(req, res, next) {
  let { _id } = req.headers
  let { id, hash } = req.body
  try {
    let legacy = await Legacies.findDetailByHash(hash, id)
    if (legacy.paid) return res.status(200).send({ error: 'Ya se habia marcado como pagado' }).end()

    legacy.paid = true
    legacy.paidAt = Date.now()
    legacy.status = 'paid'

    legacy.save()

    socketEmit('update/legacies', legacy.payer.ownerId)

    res.status(200).send({ status: true, id, hash }).end()
  } catch (e) {
    next(e)
  }
}

async function confirm(req, res, next) {
  let { _id } = req.headers
  let { id, hash } = req.body
  try {
    let legacy = await Legacies.findDetailByHash(hash, id)

    if (!legacy.paid) return res.status(500).send({ error: 'No se ha marcado como pagado' }).end()
    if (legacy.confirmed) return res.status(500).send({ error: 'Ya se ha marcado como confirmado' }).end()

    legacy.confirmed = true
    legacy.confirmedAt = Date.now()
    legacy.status = 'confirmed'  
    legacy.save()

    socketEmit('update/legacies', legacy.payer.ownerId)
    socketEmit('update/user', legacy.payer.ownerId)
    // Verificar estado de los otros legados a ver si pasa
    let statusOfSet = await _checkSetStatus(legacy.payerMembershipId)

    _checkPayerStatus(legacy.payerMembershipId, statusOfSet)
    _checkAnnexStatus(legacy.hash)

    res.status(200).send({ confirmed: true, statusOfSet }).end()
  } catch (e) {
    console.log(e)
    next(e)
  }
}

async function createNewLegaciesSet(membershipId, toPay, subscription) {
  let legacies = []
  // crear X legados pendientes
  for (let i = 0; i < toPay; i++) {
    let legacyAssigned = await _assignInLegacy(membershipId)
    legacies.push(legacyAssigned.id)
  }

  let sub
  if (subscription) {
    sub = []
    let newSubscription = await SubscriptionController.createSubscription(membershipId)
    sub.push(newSubscription.id)
  }

  return SetOfLegacies.create({
    legacies: JSON.stringify(legacies),
    subscriptions: JSON.stringify(sub),
    membershipId: membershipId
  })
}

async function _checkAnnexStatus(legacyHash) {
  try {
    // Get legacy hash
    let legacies = await Legacies.findAllByHash(legacyHash)
    let count = legacies.length

    let confirmeds = 0
    let annexId
    legacies.map(el => {
      if (el.status === 'confirmed')++confirmeds
      annexId = el.annexId
    })

    if (count === confirmeds) {
      await AnnexController.increaseAnnexLevel(annexId)
    }
  } catch (e) {
    return { error: e }
  }
}

async function _checkPayerStatus(payerId, update) {
  // Update Payer Status
  let payer = await Membership.findById(payerId)

  // si es suscriptor y ya pago todo debe pasar a ser legador
  if (update && payer.status === 'subscriber') {
    payer.status = 'giver'
    payer.save()
    socketEmit('update/user', payer.ownerId)
  } else if (update && payer.status === 'receiver') {
    let annex = await Annex.findByUserIdAndType(payer.id, payer.annexTypeId)
    if (annex.id) await AnnexController.increaseAnnexLevel(annex.id)
  }
  if (payer.parentId == 1 | 2 | 3 | 4) return
  UserControler._checkParentStatus(payer.parentId)
  let grandfather = await User.findByUserId(payer.parentId)
  if (grandfather == 1 | 2 | 3 | 4) return
  UserControler._checkParentStatus(grandfather.parentId)
}

// Esto es para usar cuando se confirman los legados
async function _checkSetStatus(payerId) {
  try {
    let setOfLegacies = await SetOfLegacies.findActive(payerId)
    if (!setOfLegacies) return false
    let legacies = JSON.parse(setOfLegacies.legacies)
    let subscriptions = JSON.parse(setOfLegacies.subscriptions) || []
    let set = await SetOfLegacies.find({
      where: {
        id: setOfLegacies.id
      }
    })

    let confirmedLegacies = 0
    let confirmedSubscriptions = 0
    let legaciesCount = legacies.length
    let subscriptionsCount = subscriptions.length
    let canUpdate = false

    //Verifica los legados configmados
    for (let i = 0; i < legacies.length; i++) {
      const el = legacies[i];
      let legacy = await Legacies.findById(el)
      if (legacy.status === 'confirmed')++confirmedLegacies
    }

    if (confirmedLegacies === legaciesCount) {
      if (subscriptions) {
        for (let j = 0; j < subscriptions.length; j++) {
          const sus = subscriptions[j];
          let subscription = await Subscriptions.findById(sus)
          if (subscription.status === 'confirmed')++confirmedSubscriptions
        }

        if (confirmedSubscriptions === subscriptionsCount) {
          canUpdate = true
        }
      } else {
        canUpdate = true
      }
    }

    if (canUpdate) {
      set.status = 'complete'
      await set.save()
    }
    console.log()
    return canUpdate
  } catch (e) {
    console.log(e)
    throw e
  }
}

async function findNullByUser(req, res, next) {
  let { _id } = req.headers
  let { membershipId } = req.params
  //console.log(membershipId)
  try {
    let nullInSet = await SetOfLegacies.findNullByUser(membershipId)

    res.status(200).send({ nullInSet: nullInSet.length }).end()
  } catch (e) {
    next(e)
  }
}

/**
 * CRON JOBS 
 */

async function cronCheckNullLegacies() {
  let sets = await SetOfLegacies.findNull()
  let pendCount = 0;
  for (let i = 0; i < sets.length; i++) {
    const el = sets[i]
    let legacies = JSON.parse(el.legacies)
    for (let j = 0; j < legacies.length; j++) {
      const legacy = legacies[j];
      if (legacy == null || legacy == 'null') {

        let pending = await _assignInLegacy(el.membershipId)
        if (pending instanceof Legacies) {
          legacies.splice(j, 1)
          legacies.push(pending.id)
          el.legacies = JSON.stringify(legacies)
          await el.save()
        } else {
          AnnexController.createHelpAnnex(el.membershipId)
        }
      }
    }
  }
  // if (pendCount > 0) {
  //   console.log('Creando ' + pendCount)
  //   AnnexController.createHelpAnnex(10)
  //   //cronCheckNullLegacies()
  // }

}

export default {
  getPending,
  assignInLegacy,
  getDetail,
  getBenefits,
  paid,
  confirm,
  createNewLegaciesSet,
  findNullByUser,
  _findRandomLegacy,
  initializeProgress,
  cronCheckNullLegacies
}