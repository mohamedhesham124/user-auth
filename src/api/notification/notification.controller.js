const asyncFun = require('../../middlewares/async.handler');
const NotificationService = require('./notification.service');
const { success } = require('../../utils/ApiResponse');

const notificationService = new NotificationService();

class NotificationController {
  /**
   * Create a new notification
   * POST /api/v1/notifications
   */
  createNotification = asyncFun(async (req, res) => {
    const { user_id, type, data, delivery_meta } = req.body;

    const notification = await notificationService.createNotification(
      user_id,
      type,
      data,
      delivery_meta
    );

    return success(
      res,
      "Notification created successfully",
      notification,
      201
    );
  });

  /**
   * Get all notifications for the logged-in user
   * GET /api/v1/notifications?page=1&limit=20
   */
  getUserNotifications = asyncFun(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const result = await notificationService.getUserNotifications(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    return success(res, "Notifications fetched successfully", result);
  });

  /**
   * Get unread notifications for the logged-in user
   * GET /api/v1/notifications/unread?page=1&limit=20
   */
  getUnreadNotifications = asyncFun(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const result = await notificationService.getUnreadNotifications(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    return success(res, "Unread notifications fetched successfully", result);
  });

  /**
   * Get notifications by type
   * GET /api/v1/notifications/type/:type?page=1&limit=20
   */
  getNotificationsByType = asyncFun(async (req, res) => {
    const userId = req.user.id;
    const { type } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const result = await notificationService.getNotificationsByType(
      userId,
      type,
      parseInt(page),
      parseInt(limit)
    );

    return success(res, "Notifications fetched successfully", result);
  });

  /**
   * Get a single notification by ID
   * GET /api/v1/notifications/:id
   */
  getNotificationById = asyncFun(async (req, res) => {
    const notification = await notificationService.getNotificationById(
      req.params.id
    );

    return success(res, "Notification fetched successfully", notification);
  });

  /**
   * Mark a notification as read
   * PUT /api/v1/notifications/:id/read
   */
  markAsRead = asyncFun(async (req, res) => {
    const notification = await notificationService.markNotificationAsRead(
      req.params.id
    );

    return success(res, "Notification marked as read", notification);
  });

  /**
   * Mark multiple notifications as read
   * PUT /api/v1/notifications/read/multiple
   */
  markMultipleAsRead = asyncFun(async (req, res) => {
    const { notificationIds } = req.body;

    const result = await notificationService.markMultipleAsRead(
      notificationIds
    );

    return success(res, result.message, { count: notificationIds.length });
  });

  /**
   * Mark all notifications as read for logged-in user
   * PUT /api/v1/notifications/read/all
   */
  markAllAsRead = asyncFun(async (req, res) => {
    const userId = req.user.id;

    const result = await notificationService.markAllAsRead(userId);

    return success(res, result.message, { markedCount: result.markedCount });
  });

  /**
   * Get unread notification count
   * GET /api/v1/notifications/unread/count
   */
  getUnreadCount = asyncFun(async (req, res) => {
    const userId = req.user.id;

    const result = await notificationService.getUnreadCount(userId);

    return success(res, "Unread count fetched", result);
  });

  /**
   * Update notification delivery status
   * PATCH /api/v1/notifications/:id/delivery
   */
  updateDeliveryStatus = asyncFun(async (req, res) => {
    const { channel, status } = req.body;

    const notification = await notificationService.updateDeliveryStatus(
      req.params.id,
      channel,
      status
    );

    return success(
      res,
      "Delivery status updated",
      notification
    );
  });

  /**
   * Delete a notification
   * DELETE /api/v1/notifications/:id
   */
  deleteNotification = asyncFun(async (req, res) => {
    await notificationService.deleteNotification(req.params.id);

    return success(res, "Notification deleted successfully", null, 204);
  });

  /**
   * Cleanup old notifications (Admin only)
   * POST /api/v1/notifications/cleanup?days=30
   */
  cleanupOldNotifications = asyncFun(async (req, res) => {
    const { days = 30 } = req.query;

    const result = await notificationService.cleanupOldNotifications(
      parseInt(days)
    );

    return success(res, result.message, result);
  });
}

module.exports = new NotificationController();
