'use strict'

import db from '../db'
const {sequelize, Sequelize} = db

const model = () => {
  const legacies = sequelize.define('legacies', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    paid: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    confirmed: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    level: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    assignedAt: {
      type: Sequelize.DATE,
      allowNull: true
    },
    paidAt: {
      type: Sequelize.DATE,
      allowNull: true
    },
    confirmedAt: {
      type: Sequelize.DATE,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM,
      values: ['empty', 'pending', 'paid', 'confirmed', 'revision', 'complete'],
      defaultValue: 'empty'
    },
  })

  return legacies
}

const Model = model()
const Op = Sequelize.Op

Model.findById = (id) => {
  return Model.find({
    where : {
      id
    }
  })
}

Model.findPendingLegacies = (payerMembershipId) => {
  return Model.findAll({
    where: {
      payerMembershipId,
      status: {
        [Op.in]: ['paid', 'pending']
      },
    },
    include: [
      {
        association: 'annex',
        include: [
          'membership',
          'type'
        ]
      }
    ]
  })  
}

Model.findOtherLegacies = (payerMembershipId) => {
  return Model.findAll({
    where: {
      payerMembershipId
    }
  })  
}

Model.findDetailByHash = (hash, id, show = 'owner') => {
  let include = []
  
  if (show === 'payer') {
    include.push(
      {association: 'payer', include: ['contacts']},
      {
        association: 'annex',
        include: [
          'type'
        ]
      }
    )
  } else {
    include.push(
      {
        association: 'annex',
        include: [
          {association: 'owner', include: ['contacts', 'accounts']},
          'type'
        ]
      }
    )
  }

  return Model.find({
    where: {
      id,
      hash
    },
    include: include
  })  
}

export default Model
