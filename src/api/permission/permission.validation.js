const Joi = require("joi");

const createPermissionSchema = Joi.object({
    name: Joi.string().min(2).max(100).required()
});

const updatePermissionSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional()
});

module.exports = { createPermissionSchema, updatePermissionSchema };