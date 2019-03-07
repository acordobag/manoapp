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

export default {
  create,
  getAll,
  getData
}