'use strict'

import db from '../db'
const {sequelize, Sequelize} = db

const model = () => {
  const contacts = sequelize.define('contact', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    value: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  })

  return contacts
}

const Model = model()


export default Model
