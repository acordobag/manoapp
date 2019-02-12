'use strict'

/**
 *
 * @param {'public', 'private', 'adminOnly', 'superAdminOnly'} lockType
 * @param {*} permissions
 */
export function check (lockType) {
  return async (req, res, next) => {
    let {permissions} = req.headers
    let roles = await _setRoles(permissions)
    let isAuth
    switch (lockType) {
      case 'public':
        isAuth = roles >= 1
        break
      case 'private':
        isAuth = roles >= 2
        break
      case 'admin':
        isAuth = roles >= 3
        break
      case 'superadmin':
        isAuth = roles === 4
        break
    }

    if (isAuth) {
      next()
    } else {
      res.status(401).send({
        status: 401,
        isAuth,
        message: 'Unauthorized'
      }).end()
    }
  }
}

function _setRoles (permissions) {
  switch (permissions) {
    case 'user':
      return 1
    case 'broker':
      return 2
    case 'admin':
      return 3
    case 'superadmin':
      return 4
    default:
      return 1
  }
}