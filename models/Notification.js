'use strict'

import db from '../db'

const {sequelize, Sequelize} = db

const model = () => {
  const Notification = sequelize.define('notification', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    url: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM,
      values: ['unread', 'read', 'deleted'],
      allowNull: false,
      defaultValue: 'unread'
    },
  })

  return Notification
}

// Custom Querys
const Model = model()


export default Model
