'use strict'

import {getEstructure} from '../helpers/annex'
import User from '../models/User'
import Annex from '../models/Annex'
import AnnexType from '../models/AnnexType'
import Legacies from '../models/Legacies'

import {createNewLegaciesSet} from '../controllers/Legacies'

import uniqid from 'uniqid'

async function getAnnexes (req, res, next) {
  let {_id} = req.headers
  try {
    let annex = await Annex.findByUserId(_id)
    res.status(200).send(annex).end()
  } catch (e) {
    next(e)
  }
}

async function createAnnex(req, res, next) {
  let {_id} = req.headers
  try {
    // Verify User Status To create Annex
    let user = await User.findByUserId(_id)

    if (user.status !== 'receiver') return res.status(500).send({error: "No puede ser receptor todavia"}).end()
    // Verificar que no tenga otro Annexo del mismo nivel activo
    let otherAnnexes = await Annex.findOthersOfSame(_id, 1)

    if(otherAnnexes.length) return res.status(500).send({error: "Ya tiene un anexo creado"}).end()

    let newAnnex = await Annex.create({
      status: 'active',
      currentLevel: null,
      ownerId: _id,
      annexTypeId: 1
    })
  
    //Creamos el primer Nivel 
    await _createLevel(newAnnex.id)
  
    res.status(200).send({newAnnex}).end()
  } catch (e) {
    next(e)
  }
}

async function detail (req, res, next) {
  let {_id} = req.headers
  let {hash, id} = req.params

  try {
    let legacy = await Legacies.findDetailByHash(hash, id, 'payer')

    res.status(200).send(legacy).end()
  } catch (e) {
    next(e)
  }
}

async function test (req, res, next) {
  let annexId = 6

  try {
    let result = await _createLevel(annexId)
    res.status(200).send(result).end()
  } catch (e) {
    next(e)
  }
}

async function _createLevel (annexId) {
  try {
    // Get The Annex
    let annex = await Annex.find({where: {id: annexId}})

    // Get the type and estructure of the annex to create the corresponding legacies
    let type = await AnnexType.find({where: {id: annex.annexTypeId}})

    let cordinates = type.estructure
    let estructure = getEstructure(cordinates)
    // Check level to create
    let currentLevel = annex.currentLevel
    let toCreateLevel
    let maxLevels = estructure.length

    if (!currentLevel) {
      toCreateLevel = 1
    } else {
      toCreateLevel = (currentLevel) + 1
    }

    // Verificamos si el nivel que hay que crear es el ultimo
    if (currentLevel === maxLevels) {
      // REINICIAR ANEXO
      // CONTADOR DE VUELTAS
      // EMPEZAR EN NIVEL 1
    }

    // Create the corresponding Level -> se le resta 1 para que concuerde con el index del arreglo
    let toCreate = estructure[(toCreateLevel) - 1]
    
    if (toCreate.toRecibe === 0 && toCreate.toPay >= 1) {
      await createNewLegaciesSet(annex.ownerId, toCreate.toPay, toCreate.subscription)
    } else {
      let legaciesQuantity = toCreate.toRecibe
      await _createLegacies(annexId, toCreateLevel, legaciesQuantity)
    }

    return {created: true, estructure, maxLevels, toCreateLevel, legaciesQuantity, currentLevel, toCreate}
  } catch (e) {
    return {error: true}
  }
}

export async function increaseAnnexLevel (annexId) {
  try {
    let annex = await Annex.find({where: {id: annexId}})

    let nextLevel

    if(!annex.currentLevel) {
      nextLevel = 1
    } else {
      nextLevel = ++annex.currentLevel
    }

    annex.currentLevel = nextLevel

    await annex.save()
    
    return _createLevel(annex.id)
  } catch (e) {
    console.log(e)
    return {error: e}
  }
}

async function _createLegacies (annexId, level, quantity) {
  let hash = uniqid().toUpperCase()
  // Create the legacies
  for (let i = 0; i < quantity; i++) {
    await Legacies.create({
      level,
      hash,
      annexId
    })
  }
}


export default {
  createAnnex,
  getAnnexes,
  test,
  detail
}