'use strict'

import db from '../db'
const {sequelize, Sequelize} = db

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

Model.findByType = annexTypeId => {
  return Model.findAll({
    where: {
      annexTypeId,
      status: 'active'
    },
    include: [
      {association: 'owner', attributes: ['id', 'name', 'lastname']},
      {
        association: 'legacies',
        where: {
          status: 'empty'
        },
        order: [
          Sequelize.fn('RAND'),
        ],
        limit: 1
      },
    ],
    order: [
      Sequelize.fn('RAND'),
    ],
    limit: 10
  })
}

Model.findByUserId = (ownerId) => {
  return Model.findAll({
    where: {
      ownerId
    },
    include: [
      'type',
      {
        association: 'legacies',
        include: ['payer'],
        where: {
          status: {
            [Op.ne]: ['complete']
          }
        }
      }
    ]
  })
}

Model.findByUserIdAndType = (ownerId, annexTypeId ) => {
  return Model.find({
    where: {
      ownerId,
      annexTypeId,
      status: 'active'
    }
  })
}

Model.findOthersOfSame = (ownerId, annexTypeId) => {
  return Model.findAll({
    where: {
      ownerId,
      annexTypeId,
      status: 'active'
    }
  })
}

export default Model
