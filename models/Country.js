'use strict'
import db from '../db'

const {sequelize, Sequelize} = db

const model = () => {
  const Country = sequelize.define('country', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    dialCode: {
      type: Sequelize.STRING,
      allowNull: true
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  })

  return Country
}

const Model = model()

export default Model