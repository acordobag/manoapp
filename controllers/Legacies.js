'use strict'

import Legacies from '../models/Legacies'
import Subscriptions from '../models/Subscription'
import Annex from '../models/Annex'
import User from '../models/User'
import SetOfLegacies from '../models/SetOfLegacies'
import { _checkParentStatus } from './User'

import { createSubscription } from '../controllers/Subscription'
import { increaseAnnexLevel, createHelpAnnex } from '../controllers/Annex'
import { socketEmit } from '../helpers/sockets'

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

  try {
    let pendingLegacies = await Legacies.findPendingLegacies(_id)

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
  try {
    let annexes = await Annex.findByUserId(_id)
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
    next(e)
  }
}


async function initializeProgress(req, res, next) {
  let { _id } = req.headers

  try {
    // Chequear que el estado del usuario sea Suscriber para poder ponerle los 2 primero legados
    let user = await User.findByUserId(_id)
    let result = {}

    // Chequear que no tenga otros asignados
    let otherLegacies = await SetOfLegacies.findActive(_id)

    if (otherLegacies) return res.status(500).send({ error: 'user have other legacies' }).end()

    if (user.status = 'subscriber') {
      await createNewLegaciesSet(_id, 2, false)
    }

    res.status(200).send(result).end()
  } catch (e) {
    console.log(e)
    next(e)
  }
}

async function _assignInLegacy(userId) {
  try {
    let legacyData = await _findRandomLegacy()
    //if(!legacyData) return null;
    let legacy = await Legacies.find({ where: { id: legacyData.id } })

    legacy.assignedAt = Date.now()
    legacy.payerId = userId
    legacy.status = 'pending'

    //Notificar y Sockets

    let data = await legacy.save()

    return data
  } catch (e) {
    console.log('Error on generate legacies')
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

  if (!emptyLegacy) {
    attemps = 0
    annexes = await Annex.findByType(2)

    while (!emptyLegacy && attemps < annexes.length) {
      let randNumber = Math.floor(Math.random() * annexes.length)
      emptyLegacy = annexes[randNumber].legacies[0]
      ++attemps
    }
  }

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

    socketEmit('update/legacies', legacy.payerId)

    res.status(200).send({ status: true, id, hash, setOfLegacies }).end()
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

    socketEmit('update/legacies', legacy.payerId)
    // VErigicar estado de los otros legados a ver si pasa
    let statusOfSet = await _checkSetStatus(legacy.payerId)

    _checkPayerStatus(legacy.payerId, statusOfSet)

    _checkAnnexStatus(legacy.hash)

    // Chequeo si los otros de SETOFLEGACIES ya fueron pagados para hacer el UPDATE del usuario o hacerle otros legados
    res.status(200).send({ confirmed: true, statusOfSet }).end()
  } catch (e) {
    console.log(e)
    next(e)
  }
}

export async function createNewLegaciesSet(userId, toPay, subscription) {
  let legacies = []
  // crear X legados pendientes
  for (let i = 0; i < toPay; i++) {
    let legacyAssigned = await _assignInLegacy(userId)
    legacies.push(legacyAssigned.id)
  }

  let sub
  if (subscription) {
    sub = []
    let newSubscription = await createSubscription(userId)
    sub.push(newSubscription.id)
  }

  return SetOfLegacies.create({
    legacies: JSON.stringify(legacies),
    subscriptions: JSON.stringify(sub),
    ownerId: userId
  })
}

async function _checkAnnexStatus(legacyHash) {
  try {
    // Get legacy hash
    let legacies = await Legacies.findAll({ where: { hash: legacyHash } })
    let count = legacies.length

    let confirmeds = 0
    let annexId
    legacies.map(el => {
      if (el.status === 'confirmed')++confirmeds
      annexId = el.annexId
    })

    if (count === confirmeds) {
      await increaseAnnexLevel(annexId)
    }
  } catch (e) {
    return { error: e }
  }
}

async function _checkPayerStatus(payerId, update) {
  // Update Payer Status
  let payer = await User.findByUserId(payerId)

  // si es suscriptor y ya pago todo debe pasar a ser legador
  if (update && payer.status === 'subscriber') {
    payer.status = 'giver'
    payer.save()
    socketEmit('update/user', payer.id)
  } else if (update && payer.status === 'receiver') {
    // TODO SACAR EL TYPE DINAMICO
    let annex = await Annex.findByUserIdAndType(payer.id, 1)
    if (annex.id) await increaseAnnexLevel(annex.id)
  }
  if (payer.parentId < 3) return
  _checkParentStatus(payer.parentId)
  let grandfather = await User.findByUserId(payer.parentId)
  _checkParentStatus(grandfather.parentId)
}

// Esto es para usar cuando se confirman los legados
async function _checkSetStatus(payerId) {
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

  return canUpdate
}

async function findNullByUser(req, res, next) {
  let { _id } = req.headers

  try {
    let nullInSet = await SetOfLegacies.findNullByUser(_id)

    res.status(200).send({ nullInSet: nullInSet.length }).end()
  } catch (e) {
    next(e)
  }
}

/**
 * CRON JOBS 
 */

export async function cronCheckNullLegacies() {
  let sets = await SetOfLegacies.findNull()
  let pendCount = 0;
  for (let i = 0; i < sets.length; i++) {
    const el = sets[i]
    let legacies = JSON.parse(el.legacies)

    for (let j = 0; j < legacies.length; j++) {
      const legacy = legacies[j];
      if (legacy == null || legacy == 'null' ) {
        
        let pending = await _assignInLegacy(el.ownerId)
        //console.log(pending)
        if (pending instanceof Legacies) {
          legacies.splice(j, 1)
          legacies.push(pending.id)
          el.legacies = JSON.stringify(legacies)
          await el.save()
        } else {
          pendCount++
        }
      }
    }
  }
  if (pendCount) {
    console.log('Creando ' + pendCount)
    createHelpAnnex()
  }

}

export default {
  getPending,
  assignInLegacy,
  getDetail,
  getBenefits,
  paid,
  confirm,
  findNullByUser,
  _findRandomLegacy,
  initializeProgress
}