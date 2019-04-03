'use strict'

import db from '../db'

const { sequelize, Sequelize } = db

const model = () => {
    const Parameters = sequelize.define('Parameters', {
        key: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        value: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

    return Parameters
}

// Custom Querys
const Model = model()

async function findParam(key) {
    let result = await Model.find({
        where: {
            key
        }
    })
    return result
}
// Custom methods
Model.findParam = findParam

export default Model
