import Membership from '../models/Membership'


async function create(pMembership) {
  let m
  try {
    m = await Membership.create(memberhip)
  } catch (error) {
    console.log(error)
  }

  return m
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

async function getByUserId(req, res, next) {
  let { _id } = req.headers

  try {
    let memberships = await Membership.findInGiverStateByOId(_id)

    res.status(200).send(memberships).end()
  } catch (e) {
    next(e)
  }
}

export default {
  create,
  //getAll,
  //getData,
  getLinks,
  getByUserId
}