'use strict'

import jwt from 'jsonwebtoken'
import config from '../config'

const secretKey = config.authentication.jwtSecret

export function createToken (user, expiration) {
  if (!expiration) expiration = 1800
  if (config.enviroment === 'development') expiration = 1800000

  let payload = {
    _id: user.id,
    permissions: user.permissions
  }

  return jwt.sign(payload, secretKey, { expiresIn: expiration })
}

export function verifyToken (req, res, next) {
  if (!req.headers.authorization) return res.status(401).json({error: 'Unauthorized Token'})
  let token = req.headers.authorization.split(' ')[1]
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).json({error: 'Unauthorized Token', authorization: 'invalidToken'})
    req.headers._id = decoded._id
    req.headers.permissions = decoded.permissions
    next()
  })
}
