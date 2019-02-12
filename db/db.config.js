'use strict'
import chalk from 'chalk'
import db from './index'

import User from '../models/User'
import Country from '../models/Country'
import UserImages from '../models/UserImages'
import Contacts from '../models/Contacts'
import Notification from '../models/Notification'
import Documents from '../models/Documents'
import Annex from '../models/Annex'
import AnnexType from '../models/AnnexType'
import Legacies from '../models/Legacies'
import Subscription from '../models/Subscription'
import SetOfLegacies from '../models/SetOfLegacies'
import Accounts from '../models/Accounts'

export default async () => {
    // User relations
    User.belongsTo(User, {as: 'parent', foreignKey: { allowNull: true, name: 'parentId'} })
    User.belongsTo(Country, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    User.hasOne(UserImages, {as: 'images', foreignKey: {name:'userId', allowNull: false }})
    User.hasMany(Contacts, {as: 'contacts', foreignKey: {name:'userId', allowNull: false }})
    User.hasMany(Accounts, {as: 'accounts', foreignKey: {name:'userId', allowNull: false }})
    Notification.belongsTo(User, { as: 'owner', foreignKey: { allowNull: false } })

    Annex.belongsTo(User, {as: 'owner', foreignKey: { allowNull: true, name: 'ownerId'} })
    User.hasMany(Annex, {as: 'annexes', foreignKey: {name:'ownerId', allowNull: false }})
    
    Annex.belongsTo(AnnexType, {as: 'type', foreignKey: { allowNull: false, name: 'annexTypeId'} })
    Legacies.belongsTo(Annex, {as: 'annex', foreignKey: { allowNull: false, name: 'annexId'} })
    Annex.hasMany(Legacies, {as: 'legacies', foreignKey: { allowNull: false, name: 'annexId'} })
    User.hasMany(Legacies, {as: 'pendingLegacies', foreignKey: {name:'payerId', allowNull: true }})
    Legacies.belongsTo(User, {as: 'payer', foreignKey: { allowNull: true, name: 'payerId'} })
    
    User.hasMany(Subscription, {as: 'pendingSubscriptions', foreignKey: {name:'payerId', allowNull: false }})
    Subscription.belongsTo(User, {as: 'payer', foreignKey: { allowNull: false, name: 'payerId'} })

    SetOfLegacies.belongsTo(User, {as: 'owner', foreignKey: { allowNull: false, name: 'ownerId'} })

    try {
        await db.sync({
            //alter: true
        })
    } catch (e) {
        console.log(e)
    }

    console.log(chalk.cyan('[Database] Database initialized'))
}
