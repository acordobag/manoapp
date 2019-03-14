'use strict'

import db from '../db'
const {sequelize, Sequelize} = db

const model = () => {
  const subscriptions = sequelize.define('subscriptions', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    amount: {
      type: Sequelize.DECIMAL(10,2),
      defaultValue: 20,
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
      values: ['pending', 'paid', 'confirmed', 'revision'],
      defaultValue: 'pending'
    },
  })

  return subscriptions
}

const Model = model()
const Op = Sequelize.Op


Model.findPendingSubscriptions = (payerMembershipId) => {
  return Model.findAll({
    where: {
      payerMembershipId,
      status: {
        [Op.in]: ['paid', 'pending']
      }
    }
  })  
}


Model.findOtherSubscriptions = (payerMembershipId, hash) => {
  return Model.findAll(
    {
      where: {
        payerMembershipId,
        hash: {[Op.ne]: hash}
      }
    }
  )
}

Model.findById = id => {
  return Model.find({
    where: {
      id
    }
  })
}

export default Model
