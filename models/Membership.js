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
  'type'
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

async function findById(id) {
  let result = await Model.find({
    where: {
      id
    },
    include: includes
  })

  return result
}



// Custom methods
// Model.findByUsername = findByUsername
// Model.findByEmail = findByEmail
Model.findById = findById
// Model.findByReferralCode = findByReferralCode
// Model.findByFacebookId = findByFacebookId
// Model.findDetailUserById = findDetailUserById
// Model.findAllDetailed = findAllDetailed
// Model.findAdvisers = findAdvisers
// Model.findAdmins = findAdmins
Model.findLinks = findLinks

export default Model
