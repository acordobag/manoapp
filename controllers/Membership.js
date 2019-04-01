import Membership from '../models/Membership'
import User from '../models/User'
import SubscriptionController from './Subscription'

async function create(pMembership) {
  let m
  try {
    m = await Membership.create(memberhip)
  } catch (error) {
    console.log(error)
  }

  return m
}

async function findById(req, res, next) {
  let { id } = req.params
  try {
    let mem = await Membership.findById(id)
    res.status(200).send(mem).end()
  } catch (error) {
    next()
    console.log(error)
  }
}

async function getLinks(req, res, next) {
  let { _id } = req.headers
  try {
    let linksByMembership = []
    let links
    let memberships = await Membership.findByOwnerId(_id)

    for (let mem of memberships) {
      links = await Membership.findLinks(mem.id)
      linksByMembership.push({
        membership: mem,
        links: links
      })
    }

    res.status(200).send(linksByMembership).end()
  } catch (e) {
    console.log(e)
    next(e)
  }
}

async function getGiverAccountsByUserId(req, res, next) {
  let { _id } = req.headers

  try {
    let memberships = await Membership.findInGiverStateByOId(_id)

    res.status(200).send(memberships).end()
  } catch (e) {
    next(e)
  }
}

async function getAllByUserId(req, res, next) {
  let { _id } = req.headers

  try {
    let memberships = await Membership.findByOwnerId(_id)

    res.status(200).send(memberships).end()
  } catch (e) {
    next(e)
  }
}

async function confirmMembership(req, res, next) {
  let { id } = req.body

  try {
    let membership = await Membership.findById(id, true)
    membership.status = 'confirmed'

    let result = await membership.save()
    // Create pending Subscription
    let subscription = await SubscriptionController.createSubscription(id)

    result.subscription = subscription

    let user = await User.findByUserId(membership.ownerId)

    res.status(200).send({ membership: result, owner: user }).end()
  } catch (e) {
    console.log(e)
    next(e)
  }
}

export default {
  create,
  //getAll,
  findById,
  confirmMembership,
  getLinks,
  getAllByUserId,
  getGiverAccountsByUserId
}