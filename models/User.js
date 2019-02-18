'use strict'
// Libraries
import bcrypt from 'bcryptjs'

import db from '../db'
const {sequelize, Sequelize} = db

const model = () => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    identification: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      set: function (value) {
        this.setDataValue('username', value.toLowerCase())
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
      set: function (value) {
        if (!value) return this.setDataValue('password', null)
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(value, salt)
        this.setDataValue('password', hash)
      }
    },
    permissions: {
      type: Sequelize.ENUM,
      values: ['user', 'admin', 'superadmin'],
      defaultValue: 'user'
    },
    facebookId: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    },
    status: {
      type: Sequelize.ENUM,
      values: ['created', 'confirmed', 'subscriber', 'giver', 'active', 'qualified', 'receiver', 'suspended', 'deleted'],
      defaultValue: 'created'
    }
  }, {
    getterMethods: {
      fullName () {
        let fullName = `${this.name} ${this.lastname}`
        return fullName.replace(/\s\s+/g, ' ')
      }
    }
  })

  return User
}

// Custom Querys
const Model = model()
const includes = [
  'images',
  'country',
  'contacts',
  'accounts',
  {association: 'parent', attributes: ['id', 'name', 'lastname']}
]

const detailed = [
  {
    association: 'images',
    attributes: { exclude: ['id', 'userId'] }
  },
  {association: 'country', attributes: { exclude: ['id'] }}
]

async function findByUsername (username) {
  let result = await Model.find({
    where: {
      username
    },
    attributes: { exclude: ['countryId', 'parentId'] },
    include: includes
  })

  return result
}

async function findByEmail (username) {
  let result = await Model.find({
    where: {
      email: username
    },
    attributes: { exclude: ['countryId', 'parentId'] },
    include: includes
  })

  return result
}

async function findLinks (parentId) {
  let result = await Model.findAll({
    where: {
      parentId
    },
    attributes: { exclude: ['countryId', 'parentId'] },
    include: includes
  })

  return result
}

async function findByUserId (id) {
  let result = await Model.find({
    where: {
      id
    },
    attributes: { exclude: ['countryId', 'parentId'] },
    include: includes
  })

  return result
}

function findByReferralCode (referralCode) {
  return Model.find({
    where: {
      referralCode
    },
    attributes: ['id']
  })
}

function findByFacebookId (facebookId) {
  return Model.find({
    where: {
      facebookId
    },
    attributes: { exclude: ['countryId', 'parentId'] },
    include: includes
  })
}

function findDetailUserById (userId) {
  return Model.findOne({
    where: {
      id: userId
    },
    attributes: { exclude: ['countryId', 'parentId'] },
    include: detailed
  })
}

function findAllDetailed () {
  return Model.findAndCountAll({
    attributes: { exclude: ['countryId', 'parentId'] },
    include: detailed,
    order: [['status', 'desc'], ['id', 'desc']]
  })
}

function findAdvisers () {
  return Model.findAll({
    where: {
      isAdviser: true
    },
    attributes: ['id', 'name', 'lastname', 'email']
  })
}

function findAdmins () {
  return Model.findAll({
    where: {
      permissions: 'admin'
    },
    attributes: ['id', 'name', 'lastname', 'email']
  })
}

// Custom methods
Model.findByUsername = findByUsername
Model.findByEmail = findByEmail
Model.findByUserId = findByUserId
Model.findByReferralCode = findByReferralCode
Model.findByFacebookId = findByFacebookId
Model.findDetailUserById = findDetailUserById
Model.findAllDetailed = findAllDetailed
Model.findAdvisers = findAdvisers
Model.findAdmins = findAdmins
Model.findLinks = findLinks

export default Model
