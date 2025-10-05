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

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
});

const changeProfilePictureSchema = Joi.object({
    profilePicture: Joi.string().uri().required()
});

module.exports = { 
    createProfileSchema, 
    updateProfileSchema, 
    changePasswordSchema,
    changeProfilePictureSchema
};