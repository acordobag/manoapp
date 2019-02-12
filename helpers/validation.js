// const debug = require('debug')('matchups:validationHelpers')
import Joi from 'joi'

export function validateParam (schema, param) {
  return (req, res, next) => {
    const result = Joi.validate({ param: req.params[param] }, schema, {convert: true})

    if (result.error) return res.status(400).json(result.error)

    if (!req.value) req.value = {}
    if (!req.value.params) req.value.params = {}

    req.value.params[param] = result.value.param
    next()
  }
}

export function validateBody (schema) {
  return (req, res, next) => {
    const result = Joi.validate(req.body, schema, {convert: true})
    if (result.error) return res.status(400).json(result.error)

    if (!req.value) req.value = {}
    if (!req.value.body) req.value.body = {}

    req.value.body = result.value
    next()
  }
}

export const schemas = {
  // Param Id Schema
  idSchema: Joi.object().keys({
    param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  // Users Schema
  user: {
    data: Joi.object().keys({
      name: Joi.string().required(),
      lastname: Joi.string().required(),
      email: Joi.string().email().required(),
      countryId: Joi.number().allow('').required(),
      username: Joi.string().alphanum().min(3).max(30).optional(),
      password: Joi.string().optional(),
      referredBy: Joi.string().allow(['', null]).optional(),
      facebookId: Joi.string().allow(['', null]).optional(),
      photo: Joi.string().allow(['', null]).optional()
    }),
    username: Joi.object().keys({
      param: Joi.string().regex(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).required()
    }),
    // userLogin Schema
    login: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required()
    }),
    loginFb: Joi.object().keys({
      facebookId: Joi.string().required()
    })
  },
  pockets: Joi.object().keys({
    clientId: Joi.number().required(),
    brokerId: Joi.number().required(),
    loaderId: Joi.number().required(),
  }),
  distribute: Joi.object().keys({
    paymentId: Joi.number().required(),
    realAmount: Joi.number().required(),
    paymentType: Joi.number().required()
  })
}
