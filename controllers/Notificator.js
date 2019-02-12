'use strict'

// LIBRARIES
import moment from 'moment'
moment.locale('es')
// const debug = require('debug')('strategic:NotificatorController')
// CONTROLLERS
import {notificationEmail} from './email/Email'

// MODELS
import Notification from '../models/Notification'
import User from '../models/User'
// Sockets
import {sockets} from '../sockets'

async function notify (user, notification) {
  try {
    // Get User Notifications Settings
    notification.ownerId = user.id
    await Notification.create(notification)
    // Update by socket
    await _notifyBySocket(user.id, notification)
    // Send Email
    await _notifyByEmail(user.email, notification)

    // // if (userData.settings.notifications.sms)
    // // await notifyBySMS(user, notification)
    // // if (userData.settings.notifications.email)

    // // if (userData.settings.notifications.push)
    // // await notifyByPush(user, notification)
  } catch (e) {
    return e
  }
}

async function _notifyByEmail (email, notification) {
  switch (notification.type) {
    default:
      await notificationEmail(email, notification)
      break
  }
}

function _notifyBySocket (userId, notification) {
  let to = sockets[userId]

  if (!to) return
  to.socket.emit('newNotification', notification)
  to.socket.emit('update/notifications')
}

export async function notifyNewPayment (payerId, amount) {
  try {
    let user = await User.findByUserId(payerId)
    let time = moment().format('DD/MM/YYYY h:mm:ss a')

    let adminNotification = {
      title: `Nuevo deposito de $${amount} - ${time}`,
      message: `${user.fullName} realizó un nuevo deposito de $${amount} a su cuenta principal`,
      type: 1,
      url: `/admin/user/${user.id}?o=true`
    }

    let admins = await User.findAdmins()
    admins.map(admin => {
      notify(admin, adminNotification)
    })

    // TODO Send to broker

    let userNotification = {
      title: `Se acreditaron $${amount} a su balance`,
      message: `Se han acreditado $${amount} en su balance de cuenta y ya están disponibles`,
      type: 1,
      url: `/cash-balance`
    }

    notify(user, userNotification)
  } catch (e) {
    console.log(e)
  }
}

export async function notifyNewContract (buyerId, contractDetail) {
  try {
    let user = await User.findByUserId(buyerId)
    let {totalBuyPrice, hash} = contractDetail

    let adminNotification = {
      title: `Nueva orden de contratos ${hash}`,
      message: `${user.fullName} realizó una orden de compra, Hash: ${hash}, Total: $${totalBuyPrice}`,
      type: 2,
      url: `/admin/contracts/detail/${hash}?o=true&ref=notification`
    }

    let admins = await User.findAdmins()
    admins.map(admin => {
      notify(admin, adminNotification)
    })

    let userNotification = {
      title: `Se genero una orden de compra ${hash}`,
      message: `Se realizó su orden de compra ${hash}, Total: $${totalBuyPrice}`,
      type: 2,
      url: null
    }

    notify(user, userNotification)
  } catch (e) {
    console.log(e)
  }
}

export async function notifyApproveContract (userId, hash) {
  try {
    let user = await User.findByUserId(userId)

    let notification = {
      title: `Se aprobarón sus contratos ${hash}`,
      message: `Hola, ${user.fullName} sus contratos ${hash} fueron aprobados y ya están disponibles en su cuenta`,
      type: 3,
      url: `/portfolio/contracts/detail/${hash}?o=true&rn=contracts&ref=notificacion`
    }

    notify(user, notification)
  } catch (e) {
    console.log(e)
  }
}

export async function notifyPreSale (userId, hash) {
  try {
    let user = await User.findByUserId(userId)

    let adminNotification = {
      title: `Solicitud de venta de contratos ${hash}`,
      message: `${user.fullName} realizó una orden de venta de los contratos ${hash}`,
      type: 4,
      url: `/admin/contracts/detail/${hash}?o=true&ref=notification`
    }

    let admins = await User.findAdmins()
    admins.map(admin => {
      notify(admin, adminNotification)
    })

    let userNotification = {
      title: `Se genero una orden de venta ${hash}`,
      message: `Se realizó su orden de venta de los contratos ${hash}`,
      type: 4,
      url: `/portfolio/contracts/detail/${hash}?o=true&rn=contracts&ref=notificacion`
    }

    notify(user, userNotification)
  } catch (e) {
    console.log(e)
  }
}

export async function notifySale (userId, hash) {
  try {
    let user = await User.findByUserId(userId)

    let notification = {
      title: `Se aprobó su venta ${hash}`,
      message: `Sus contratos ${hash} fueron vendidos correctamente y se acreditó correctamente el balance en su cuenta`,
      type: 3,
      url: `/portfolio/contracts/detail/${hash}?o=true&rn=contracts&ref=notificacion`
    }

    notify(user, notification)
  } catch (e) {
    console.log(e)
  }
}


export async function notifyBuyBitcoin (buyerId, btcAmount, price) {
  try {
    let user = await User.findByUserId(buyerId)

    let adminNotification = {
      title: `Nueva compra de Bitcoin`,
      message: `${user.fullName} realizó una compra de ${btcAmount} Bitcoin a $${price}`,
      type: 5,
      url: `/admin/user/${user.id}?o=true`
    }

    let admins = await User.findAdmins()
    admins.map(admin => {
      notify(admin, adminNotification)
    })

    let userNotification = {
      title: `Su compra de Bitcoin fue procesada`,
      message: `Su compra de ${btcAmount} Bitcoin a $${price} fue realizada correctamente`,
      type: 5,
      url: '/cryptos'
    }

    notify(user, userNotification)
  } catch (e) {
    console.log(e)
  }
}

export async function notifySellBitcoin (buyerId, btcAmount, price) {
  try {
    let user = await User.findByUserId(buyerId)

    let adminNotification = {
      title: `Nueva venta de Bitcoin`,
      message: `${user.fullName} realizó una venta de ${btcAmount} Bitcoin a $${price}`,
      type: 5,
      url: `/admin/user/${user.id}?o=true`
    }

    let admins = await User.findAdmins()
    admins.map(admin => {
      notify(admin, adminNotification)
    })

    let userNotification = {
      title: `Su venta de Bitcoin fue procesada`,
      message: `Su venta de ${btcAmount} Bitcoin a $${price} fue realizada correctamente`,
      type: 5,
      url: '/cryptos'
    }

    notify(user, userNotification)
  } catch (e) {
    console.log(e)
  }
}