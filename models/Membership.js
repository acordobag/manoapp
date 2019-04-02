'use strict'
import db from '../db'
const { sequelize, Sequelize } = db

const model = () => {
  const Membership = sequelize.define('Membership', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: Sequelize.ENUM,
      values: ['created', 'confirmed', 'subscriber', 'giver', 'active', 'qualified', 'receiver', 'suspended', 'deleted'],
      defaultValue: 'created'
    }
  })

  return Membership
}

// Custom Querys
const Model = model()

const includes = [
  'type',
  'owner'
]

const detailed = [
  'type',
  { association: 'owner', include: ['country', 'images'] }
]

async function findById(id, flag = false) {

  let inc
  if (flag) {
    inc = ['type']
  } else {
    inc = includes
  }

  let result = await Model.find({
    where: {
      id
    },
    include: inc
  })

  return result
}

async function findByUserAndType(ownerId, membershipTypeId) {
  let result = await Model.find({
    where: {
      ownerId,
      membershipTypeId
    },
    include: includes
  })

  return result
}

async function findLinks(parentId) {
  let result = await Model.findAll({
    where: {
      parentId
    },
    include: detailed
  })

  return result
}

async function findByOwnerId(ownerId) {
  let result = await Model.findAll({
    where: {
      ownerId
    },
    include: includes
  })

  return result
}

async function findInGiverStateByOId(ownerId) {
  let result = await Model.findAll({
    where: {
      ownerId,
      status: 'giver'
    },
    include: includes
  })

  return result
}

// Custom methods
Model.findById = findById
Model.findByOwnerId = findByOwnerId
Model.findLinks = findLinks
Model.findInGiverStateByOId = findInGiverStateByOId
Model.findByUserAndType = findByUserAndType


export default Model
