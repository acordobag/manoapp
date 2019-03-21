'use strict'

import db from '../db'
const { sequelize, Sequelize } = db

const model = () => {
  const annex = sequelize.define('annex', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: Sequelize.ENUM,
      values: ['active', 'paused', 'stoped'],
      defaultValue: 'active'
    },
    currentLevel: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    lap: {
      type: Sequelize.INTEGER,
      default: 0
    }
  })

  return annex
}

const Model = model()
const Op = Sequelize.Op

const include = [
  { association: 'membership', include: ['owner'] },
  {
    association: 'legacies',
    where: { status: 'empty' }, order: [Sequelize.fn('RAND')], limit: 1
  }
]

Model.findById = (id) => {
  return Model.find({
    where: {
      id
    },
    include: [
      'type',
      { association: 'membership', include: ['owner'] },
      {
        association: 'legacies',
        where: { status: 'empty' }, order: [Sequelize.fn('RAND')], limit: 1
      }
    ]
  })
}

Model.findByType = (annexTypeId) => {
  return Model.findAll({
    where: {
      annexTypeId,
      status: 'active'
    },
    include: [
      { association: 'membership', include: ['owner'] },
      {
        association: 'legacies',
        where: { status: 'empty' }, order: [Sequelize.fn('RAND')], limit: 1
      }
    ],
    order: [
      Sequelize.fn('RAND'),
    ],
    limit: 10
  })
}

Model.findByMembershipId = (membershipId) => {
  return Model.findAll({
    where: {
      membershipId
    },
    include: [
      'type',
      {
        association: 'legacies',
        include: [{ association: 'membership', include: ['owner'] }],
        where: {
          status: {
            [Op.ne]: ['complete']
          }
        }
      },
      { association: 'membership', include: ['owner'] }
    ]
  })
}

Model.findByMembershipIdAndType = (membershipId, annexTypeId) => {
  return Model.find({
    where: {
      membershipId,
      annexTypeId,
      status: 'active'
    }
  })
}

Model.findOthersOfSame = (membershipId, annexTypeId) => {
  return Model.findAll({
    where: {
      membershipId,
      annexTypeId,
      status: 'active'
    }
  })
}

export default Model
