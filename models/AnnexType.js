'use strict'

import db from '../db'
const {sequelize, Sequelize} = db

const model = () => {
  const annexType = sequelize.define('annexType', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    estructure: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  })

  return annexType
}

const Model = model()


export default Model
