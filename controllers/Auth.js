'use strict'
// Config
import config from '../config'
// Models
import User from '../models/User'
import Contacts from '../models/Contacts'
import Nexmo from 'nexmo'

const nexmo = new Nexmo({
  apiKey: config.smsSettings.key,
  apiSecret: config.smsSettings.secret
})


async function sendVerificationCode (req, res, next) {
  let {phoneNumber} = req.body

  if (!phoneNumber) return next('Requiere numero de teléfono')

  nexmo.verify.request({number: phoneNumber, code_length: 6, brand: 'Strategic WMP'}, (err, result) => {
    if (err) {
      next(err)
    } else {
      if (result.status === '0') {
        let requestId = result.request_id
        res.status(200).send({requestId: requestId, phoneNumber})
        console.log(requestId)
      } else {
        res.status(401).send(result.error_text)
      }
    }
  })
}

async function verifyCode (req, res, next) {
  let {_id: id} = req.headers
  let {code, requestId, phoneNumber} = req.body

  // Checking to see if the code matches
  nexmo.verify.check({request_id: requestId, code}, async (err, result) => {
    if (err) {
      next(err)
    } else {
      // Error status code: https://docs.nexmo.com/verify/api-reference/api-reference#check
      if (result && result.status === '0') {
        // Put Verified in DB and save phone number in contacts
        let user = await User.findByUserId(id)
        user.status = 'active'
        await user.save()
        await Contacts.create({title: 'phone', value: phoneNumber, userId: id})
        let result = await User.findByUserId(id)
        res.status(200).send({
          resultCode: 1,
          verify: true,
          user: result
        })
      } else {
        res.status(401).send(result.error_text)
      }
    }
  })
}


export default {
  sendVerificationCode,
  verifyCode
}
