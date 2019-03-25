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
import Membership from '../models/Membership'
import MembershipType from '../models/MembershipType'

export default async () => {
    // User relations
    User.belongsTo(Country, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    User.hasOne(UserImages, {as: 'images', foreignKey: {name:'userId', allowNull: false }})
    User.hasMany(Contacts, {as: 'contacts', foreignKey: {name:'userId', allowNull: false }})
    User.hasMany(Accounts, {as: 'accounts', foreignKey: {name:'userId', allowNull: false }})
    Notification.belongsTo(User, { as: 'owner', foreignKey: { allowNull: false } })
    //
    Membership.belongsTo(Membership, {as: 'parent', foreignKey: { allowNull: true, name: 'parentId'} })
    //MembershipType anex type
    MembershipType.belongsTo(AnnexType, {as: 'AnnexType', foreignKey: { allowNull: false, name: 'annexTypeId'}})

    //User memberships
    Membership.belongsTo(User, {as: 'owner', foreignKey: { allowNull: false, name: 'ownerId'} }) // new
    User.hasMany(Membership, {as: 'memberships', foreignKey: {name:'ownerId', allowNull: false }}) // new
    //
    Membership.belongsTo(MembershipType, {as: 'type', foreignKey: { allowNull: false, name: 'membershipTypeId'} }) // new
    //Anexos y membresia
    Annex.belongsTo(Membership, {as: 'membership', foreignKey: { allowNull: false, name: 'membershipId'} }) // Changed
    Membership.hasMany(Annex, {as: 'annexes', foreignKey: {name:'membershipId', allowNull: false }}) // Changed
    //
    Annex.belongsTo(AnnexType, {as: 'type', foreignKey: { allowNull: false, name: 'annexTypeId'} })
    //legados y anexos
    Legacies.belongsTo(Annex, {as: 'annex', foreignKey: { allowNull: false, name: 'annexId'} })
    Annex.hasMany(Legacies, {as: 'legacies', foreignKey: { allowNull: false, name: 'annexId'} })
    //legados y membresia
    Legacies.belongsTo(Membership, {as: 'payer', foreignKey: { allowNull: true, name: 'payerMembershipId'} })
    Membership.hasMany(Legacies, {as: 'pendingLegacies', foreignKey: {name:'payerMembershipId', allowNull: true }})
    //Suscripciones y usuarios
    Subscription.belongsTo(Membership, {as: 'membership', foreignKey: { allowNull: false, name: 'payerMembershipId'} })
    Membership.hasMany(Subscription, {as: 'pendingSubscriptions', foreignKey: {name:'payerMembershipId', allowNull: false }})

    SetOfLegacies.belongsTo(Membership, {as: 'membership', foreignKey: { allowNull: false, name: 'membershipId'} })

    try {
        await db.sync({
            //alter: true
        })
    } catch (e) {
        console.log(e)
    }

    console.log(chalk.cyan('[Database] Database initialized'))
}
