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
  {
    association: 'images',
    attributes: { exclude: ['id', 'userId'] }
  },
  { association: 'country', attributes: { exclude: ['id'] } }
]


async function findLinks(parentId) {
  let result = await Model.findAll({
    where: {
      parentId
    },
    include: includes
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
Model.findByOwnerId = findByOwnerId
Model.findLinks = findLinks
Model.findInGiverStateByOId = findInGiverStateByOId


export default Model
