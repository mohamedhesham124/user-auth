const Joi = require("joi");

const createProfileSchema = Joi.object({
  jobTitle: Joi.string().max(100).optional(),
  company: Joi.string().max(100).optional(),
  profilePicture: Joi.string().uri().optional(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]{10,}$/).optional()
});

const updateProfileSchema = Joi.object({
  jobTitle: Joi.string().max(100).optional(),
  company: Joi.string().max(100).optional(),
  profilePicture: Joi.string().uri().optional(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]{10,}$/).optional()
});

module.exports = { createProfileSchema, updateProfileSchema };