const Joi = require("joi");

const createRoleSchema = Joi.object({
    name: Joi.string().min(2).max(50).required()
});

const updateRoleSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional()
});

const addPermissionSchema = Joi.object({
    perm_id: Joi.number().integer().required()
});

module.exports = { createRoleSchema, updateRoleSchema, addPermissionSchema };