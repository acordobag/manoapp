'use strict'
import db from '../db'

const {sequelize, Sequelize} = db

const model = () => {
  const UserImages = sequelize.define('userImages', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    profile: {
      type: Sequelize.STRING,
      allowNull: true
    },
    cover: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    timestamps: false
  })

  return UserImages
}

const Model = model()


export default Model