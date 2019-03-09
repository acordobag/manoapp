import Membership from '../models/Memberhip'



async function create(pMembership) {
  let m
  try {
    m = await Membership.create(memberhip)
  } catch (error) {
    console.log(error)
  }

  return m
}

async function getByUserId(req,res,next){
  let { _id } = req.headers

  try {
    let pendingLegacies = await Legacies.findPendingLegacies(_id)

    res.status(200).send(pendingLegacies).end()
  } catch (e) {
    next(e)
  }
}

export default {
  create,
  getAll,
  getData
}