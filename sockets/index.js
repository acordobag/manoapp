'use strict'

import socketIo from 'socket.io'
import debug from 'debug'
const log = debug('swmp:sockets')

let onlineUsers = {}
let socketsList = {}
var clientsNsp
var staffNsp

export default server => {
  const io = socketIo(server)

  clientsNsp = io.of('/clients')
  staffNsp = io.of('/staff')

  // Clients Sockets
  clientsNsp.on('connection', socket => {
    let { _id, name, isStaff, isAdmin, connectedSince, enviroment } = socket.handshake.query
    connect(_id, name, isStaff, isAdmin, connectedSince, enviroment, socket)

    // On Disconnect
    socket.on('disconnect', () => {
      disconnect(_id, socket)
    })
  })

  // Staff Sockets
  staffNsp.on('connection', socket => {
    let { _id, name, isStaff, isAdmin, connectedSince, enviroment } = socket.handshake.query
    connect(_id, name, isStaff, isAdmin, connectedSince, enviroment, socket)

    // On Disconnect
    socket.on('disconnect', () => {
      disconnect(_id, socket)
    })
    // Get Connected SOCKETS
    socket.on('getOnlineUsers', () => {
      io.of('/staff').emit('userConnection', { onlineUsers })
    })
  })

  function connect (_id, name, isStaff, isAdmin, connectedSince, enviroment, socket) {
    log(`New socket ${socket.id}`)
    if (!name) return
    socketsList[_id] = {
      socketId: socket.id,
      socket: socket,
      staff: staffNsp,
      clients: clientsNsp,
      name,
    }
    onlineUsers[_id] = {
      name,
      isStaff,
      isAdmin,
      enviroment,
      connectedSince
    }

    io.of('/staff').emit('userConnection', { onlineUsers })
  }

  function disconnect (_id, socket) {
    delete onlineUsers[_id]
    delete socketsList[_id]
    log(`Disconnect socket ${socket.id}`)
    io.of('/staff').emit('userConnection', { onlineUsers })
  }
}

export const sockets = socketsList