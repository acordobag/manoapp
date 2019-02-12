'use strict'

import db from '../db'

const {sequelize, Sequelize} = db

const model = () => {
  const documents = sequelize.define('documents', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    detail: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 1
    },
    url: {
      type: Sequelize.STRING,
      allowNull: true
    }
  })

  return documents
}

// Custom Querys
const Model = model()


export default Model
