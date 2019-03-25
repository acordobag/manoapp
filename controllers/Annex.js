'use strict'
//Models
import User from '../models/User'
import Membership from '../models/Membership'
import Annex from '../models/Annex'
import AnnexType from '../models/AnnexType'
import Legacies from '../models/Legacies'
//Controllers
import LegacyController from '../controllers/Legacies'
//Helpers
import { getEstructure } from '../helpers/annex'

import uniqid from 'uniqid'

async function getAnnexes(req, res, next) {
  let { _id } = req.headers
  let { membershipId } = req.params
  try {
    let annex = await Annex.findByMembershipId(membershipId)// find by mebershipId
    res.status(200).send(annex).end()
  } catch (e) {
    next(e)
  }
}

async function createAnnex(req, res, next) {
  let { _id } = req.headers
  let { id } = req.body
  try {
    // Verify User Status To create Annex
    let user = await User.findByUserId(_id)
    let membership = await Membership.findById(id);

    if (membership.status !== 'receiver') return res.status(500).send({ error: "No puede ser receptor todavia" }).end()

    if (user.permissions !== 'superadmin') {
      // Verificar que no tenga otro Annexo del mismo nivel activo
      let otherAnnexes = await Annex.findOthersOfSame(id, membership.type.annexTypeId)
      if (otherAnnexes.length) return res.status(500).send({ error: "Ya tiene un anexo creado" }).end()
    }

    let annex = {
      status: 'active',
      currentLevel: 0,
      membershipId: id,
      annexTypeId: membership.type.annexTypeId
    };

    let newAnnex = await Annex.create(annex)

    //Creamos el primer Nivel 
    await _createLevel(newAnnex.id)

    res.status(200).send({ newAnnex }).end()
  } catch (e) {
    next(e)
  }
}

async function createHelpAnnex(membershipId) {
  let membership = await Membership.findById(membershipId)
  let annexActive = await Annex.findByType(membership.type.annexTypeId)
  let annexToCreate
  if (annexActive.length > 0) {
    annexToCreate = annexActive[0]
  } else {
    annexToCreate = await Annex.create({
      status: 'active',
      currentLevel: null,
      membershipId: membership.type.annexTypeId,
      annexTypeId: membership.type.annexTypeId
    })
  }

  await _createLegacies(annexToCreate.id, 1, 1)
}

async function detail(req, res, next) {
  let { _id } = req.headers
  let { hash, id } = req.params

  try {
    let legacy = await Legacies.findDetailByHash(hash, id, 'payer')

    res.status(200).send(legacy).end()
  } catch (e) {
    next(e)
  }
}

async function test(req, res, next) {
  let annexId = req.body.id
  try {
    let result = await _createLevel(annexId)
    res.status(200).send(result).end()
  } catch (e) {
    next(e)
  }
}

async function _createLevel(annexId) {
  try {
    // Get The Annex
    let annex = await Annex.find({ where: { id: annexId } })

    // Get the type and estructure of the annex to create the corresponding legacies
    let type = await AnnexType.find({ where: { id: annex.annexTypeId } })

    let cordinates = type.estructure
    let estructure = getEstructure(cordinates)
    // Check level to create
    let currentLevel = annex.currentLevel
    let toCreateLevel
    let maxLevels = estructure.length

    toCreateLevel = (currentLevel + 1)

    // Verificamos si el nivel que hay que crear es el ultimo
    if (currentLevel === maxLevels) {
      toCreateLevel = 1
    }
    // Create the corresponding Level -> se le resta 1 para que concuerde con el index del arreglo
    let toCreate = estructure[(toCreateLevel - 1)]

    let legaciesQuantity = toCreate.toRecibe

    if (toCreate.toRecibe === 0 && toCreate.toPay >= 1) {
      await LegacyController.createNewLegaciesSet(annex.membershipId, toCreate.toPay, toCreate.subscription)
    } else {
      await _createLegacies(annexId, toCreateLevel, legaciesQuantity)
    }

    return { created: true, estructure, maxLevels, toCreateLevel, legaciesQuantity, currentLevel, toCreate }
  } catch (e) {
    console.log(e)
    return { error: true }
  }
}

async function increaseAnnexLevel(annexId) {
  try {
    let annex = await Annex.find({ where: { id: annexId } })

    let nextLevel = (++annex.currentLevel)

    annex.currentLevel = nextLevel

    await annex.save()

    return _createLevel(annex.id)
  } catch (e) {
    console.log(e)
    return { error: e }
  }
}

async function _createLegacies(annexId, level, quantity) {
  let annex = await Annex.findById(annexId)
  let hash = uniqid().toUpperCase()
  // Create the legacies
  for (let i = 0; i < quantity; i++) {
    await Legacies.create({
      amount: annex.type.amount,
      level,
      hash,
      annexId
    })
  }
}


export default {
  createAnnex,
  createHelpAnnex,
  increaseAnnexLevel,
  getAnnexes,
  test,
  detail
}