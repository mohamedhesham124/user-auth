const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');
const { validateAuth, restrictTo } = require('../../middlewares/auth.middleware');
const { validate } = require('../../middlewares/validate');
const {
  createNotificationSchema,
  updateDeliveryStatusSchema,
  markMultipleAsReadSchema
} = require('./notification.validation');

/**
 * All notification routes require authentication
 * Base path: /api/v1/notifications
 */

// Create a new notification (Admin only - typically for system notifications)
router.post(
  '/',
  validateAuth,
  restrictTo('Admin'),
  validate(createNotificationSchema),
  notificationController.createNotification
);

// Get all notifications for logged-in user
router.get(
  '/',
  validateAuth,
  notificationController.getUserNotifications
);

// Get unread count for logged-in user
router.get(
  '/unread/count',
  validateAuth,
  notificationController.getUnreadCount
);

// Get unread notifications for logged-in user
router.get(
  '/unread',
  validateAuth,
  notificationController.getUnreadNotifications
);

// Get notifications by type
router.get(
  '/type/:type',
  validateAuth,
  notificationController.getNotificationsByType
);

// Mark all notifications as read for logged-in user
router.put(
  '/read/all',
  validateAuth,
  notificationController.markAllAsRead
);

// Mark multiple notifications as read
router.put(
  '/read/multiple',
  validateAuth,
  validate(markMultipleAsReadSchema),
  notificationController.markMultipleAsRead
);

// Cleanup old notifications (Admin only)
router.post(
  '/cleanup',
  validateAuth,
  restrictTo('Admin'),
  notificationController.cleanupOldNotifications
);

// Get single notification by ID
router.get(
  '/:id',
  validateAuth,
  notificationController.getNotificationById
);

// Mark single notification as read
router.put(
  '/:id/read',
  validateAuth,
  notificationController.markAsRead
);

// Update notification delivery status
router.patch(
  '/:id/delivery',
  validateAuth,
  restrictTo('Admin'),
  validate(updateDeliveryStatusSchema),
  notificationController.updateDeliveryStatus
);

// Delete a notification
router.delete(
  '/:id',
  validateAuth,
  notificationController.deleteNotification
);

module.exports = router;
