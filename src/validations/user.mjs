import Joi from 'joi'

export const createUserValidationSchema = Joi.object().options({ abortEarly: false }).keys({
  name: Joi.string().max(300).required().messages({
    'string.max': 'Name cannot exceed 300 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().max(300).required().email().messages({
    'string.max': 'Email cannot exceed 300 characters',
    'any.required': 'Email is required',
    'any.email': 'Email is invalid'
  }),
  password: Joi.string().max(300).required().messages({
    'string.max': 'Password cannot exceed 300 characters',
    'any.required': 'Password is required'
  })
})

export const getUserValidationSchema = Joi.object().options({ abortEarly: false }).keys({
  email: Joi.string().max(300).required().email().messages({
    'string.max': 'Email cannot exceed 300 characters',
    'any.required': 'Email is required',
    'any.email': 'Email is invalid'
  }),
  password: Joi.string().max(300).required().messages({
    'string.max': 'Password cannot exceed 300 characters',
    'any.required': 'Password is required'
  })
})
