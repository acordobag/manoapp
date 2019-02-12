'use strict'

import db from '../db'
const {sequelize, Sequelize} = db

const model = () => {
  const setOfLegacies = sequelize.define('setOfLegacies', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    legacies: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    subscriptions: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM,
      values: ['pending', 'complete'],
      defaultValue: 'pending'
    }
  })

  return setOfLegacies
}

const Model = model()
const Op = Sequelize.Op

Model.findActive = (ownerId) => {
  return Model.find({
    where: {
      ownerId,
      status: 'pending'
    }
  })
}

Model.findNull = () => {
  return Model.findAll({
    where: {
      legacies: {
        [Op.like]: '%null%'
      }
    }
  })
}

Model.findNullByUser = ownerId => {
  return Model.findAll({
    where: {
      legacies: {
        [Op.like]: '%null%'
      },
      ownerId
    }
  })
} 

export default Model
