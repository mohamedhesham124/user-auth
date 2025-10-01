// src/api/auth/auth.validation.js
const Joi = require("joi");

const signupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Admin', 'User').default('User')
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const changePasswordSchema = Joi.object({
  password: Joi.string().min(6).required()
});

module.exports = { signupSchema, signinSchema, changePasswordSchema };