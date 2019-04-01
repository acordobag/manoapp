'use strict'

import db from '../db'
const {sequelize, Sequelize} = db

const model = () => {
  const MembershipType = sequelize.define('MembershipType', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    suscriptionAmount: {
      type: Sequelize.DECIMAL(10,2),
      allowNull: false
    },
    initialLegacies: {
      type: Sequelize.INTEGER
    },
  })

  return MembershipType
}

const Model = model()


export default Model
