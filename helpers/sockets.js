'use strict'
import {sockets} from '../sockets'

export function socketEmit (message, userId, payload = null) {
  let to = sockets[userId]

  if (to) {
    to.socket.emit(message, payload)
  }
}

export function emitUpdateContracts (userId) {
  let to = sockets[userId]

  if (to) {
    to.staff.emit('update/contracts')
    to.socket.emit('update/contracts')
  }
}

export function emitUpdateCommissions (userId) {
  let to = sockets[userId]

  if (to) {
    to.staff.emit('update/commissions')
  }
}
