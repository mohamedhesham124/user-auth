const Joi = require('joi');

const createNotificationSchema = Joi.object({
  user_id: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required(),
  type: Joi.string()
    .max(50)
    .required()
    .example('new_follower'),
  data: Joi.object()
    .default({})
    .example({ follower_name: 'Dave', profile_url: '/u/dave' }),
  delivery_meta: Joi.object()
    .default({})
    .example({ email: 'sent', push: 'pending', sms: 'skipped' })
});

const updateDeliveryStatusSchema = Joi.object({
  channel: Joi.string()
    .required()
    .valid('email', 'push', 'sms', 'in_app')
    .example('email'),
  status: Joi.string()
    .required()
    .valid('pending', 'sent', 'failed', 'skipped', 'bounced')
    .example('sent')
});

const markMultipleAsReadSchema = Joi.object({
  notificationIds: Joi.array()
    .items(Joi.string().uuid({ version: 'uuidv4' }))
    .min(1)
    .required()
});

module.exports = {
  createNotificationSchema,
  updateDeliveryStatusSchema,
  markMultipleAsReadSchema
};
