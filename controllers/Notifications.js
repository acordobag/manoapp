'use strict'
import Notification from '../models/Notification'
import {socketEmit} from '../helpers/sockets'

async function getNotifications (req, res, next) {
  const {_id} = req.headers
  try {
    let notifications = await Notification.findAll({
      where: {
        ownerId: _id
      },
      order: [['id', 'DESC']]
    })
    notifications = JSON.parse(JSON.stringify(notifications))
    let unread = 0

    notifications.map(el=> {
      if (el.status === 'unread') ++unread
    })

    let result = {
      unread,
      notifications
    }
    res.status(200).send(result).end()
  } catch (e) {
    next(e)
  }
}

async function markAsRead (req, res, next) {
  let {_id} = req.headers
  let {id} = req.body

  socketEmit('update/notifications', _id)

  try {
    let mark = await Notification.update({
      status: 'read'
    }, {
      where: {
        id,
        ownerId: _id
      }
    })
    res.status(200).send(mark).end()
  } catch (e) {
    next(e)
  }
}

export default {
  getNotifications,
  markAsRead
}

