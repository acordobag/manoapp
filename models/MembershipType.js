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
    annexTypeId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    suscriptionAmount: {
      type: Sequelize.DECIMAL(10,2),
      allowNull: false
    }
  })

  return MembershipType
}

const Model = model()


export default Model
