const NotificationRepository = require('./notification.repository');

class NotificationService {
  constructor() {
    this.notificationRepository = NotificationRepository;
  }

  /**
   * Create a new notification
   */
  async createNotification(userId, type, data, deliveryMeta = {}) {
    if (!userId || !type) {
      throw { 
        statusCode: 400, 
        message: "user_id and type are required" 
      };
    }

    const notification = await this.notificationRepository.create({
      user_id: userId,
      type,
      data: data || {},
      delivery_meta: deliveryMeta
    });

    return notification;
  }

  /**
   * Get all notifications for a user with pagination
   */
  async getUserNotifications(userId, page = 1, limit = 20) {
    if (!userId) {
      throw { 
        statusCode: 400, 
        message: "user_id is required" 
      };
    }

    const offset = (page - 1) * limit;
    const result = await this.notificationRepository.findByUserId(
      userId,
      limit,
      offset
    );

    return {
      notifications: result.rows,
      pagination: {
        total: result.count,
        page,
        limit,
        pages: Math.ceil(result.count / limit)
      }
    };
  }

  /**
   * Get unread notifications for a user
   */
  async getUnreadNotifications(userId, page = 1, limit = 20) {
    if (!userId) {
      throw { 
        statusCode: 400, 
        message: "user_id is required" 
      };
    }

    const offset = (page - 1) * limit;
    const result = await this.notificationRepository.findUnreadByUserId(
      userId,
      limit,
      offset
    );

    return {
      notifications: result.rows,
      pagination: {
        total: result.count,
        page,
        limit,
        pages: Math.ceil(result.count / limit)
      }
    };
  }

  /**
   * Get notifications by type
   */
  async getNotificationsByType(userId, type, page = 1, limit = 20) {
    if (!userId || !type) {
      throw { 
        statusCode: 400, 
        message: "user_id and type are required" 
      };
    }

    const offset = (page - 1) * limit;
    const result = await this.notificationRepository.findByType(
      userId,
      type,
      limit,
      offset
    );

    return {
      notifications: result.rows,
      pagination: {
        total: result.count,
        page,
        limit,
        pages: Math.ceil(result.count / limit)
      }
    };
  }

  /**
   * Get a single notification by ID
   */
  async getNotificationById(notificationId) {
    const notification = await this.notificationRepository.findById(
      notificationId
    );

    if (!notification) {
      throw { 
        statusCode: 404, 
        message: "Notification not found" 
      };
    }

    return notification;
  }

  /**
   * Mark a single notification as read
   */
  async markNotificationAsRead(notificationId) {
    const notification = await this.notificationRepository.findById(
      notificationId
    );

    if (!notification) {
      throw { 
        statusCode: 404, 
        message: "Notification not found" 
      };
    }

    await this.notificationRepository.markAsRead(notificationId);
    return await this.notificationRepository.findById(notificationId);
  }

  /**
   * Mark multiple notifications as read
   */
  async markMultipleAsRead(notificationIds) {
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      throw { 
        statusCode: 400, 
        message: "notificationIds must be a non-empty array" 
      };
    }

    await this.notificationRepository.markMultipleAsRead(notificationIds);
    return { message: `${notificationIds.length} notification(s) marked as read` };
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    if (!userId) {
      throw { 
        statusCode: 400, 
        message: "user_id is required" 
      };
    }

    const unreadCount = await this.notificationRepository.countUnread(userId);
    await this.notificationRepository.markAllAsRead(userId);
    
    return { 
      message: `${unreadCount} notification(s) marked as read`,
      markedCount: unreadCount
    };
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId) {
    if (!userId) {
      throw { 
        statusCode: 400, 
        message: "user_id is required" 
      };
    }

    const count = await this.notificationRepository.countUnread(userId);
    return { unreadCount: count };
  }

  /**
   * Update notification delivery status
   */
  async updateDeliveryStatus(notificationId, channel, status) {
    const notification = await this.notificationRepository.findById(
      notificationId
    );

    if (!notification) {
      throw { 
        statusCode: 404, 
        message: "Notification not found" 
      };
    }

    const deliveryMeta = notification.delivery_meta || {};
    deliveryMeta[channel] = status; // e.g., {email: 'sent', push: 'pending'}

    await this.notificationRepository.updateDeliveryMeta(
      notificationId,
      deliveryMeta
    );

    return await this.notificationRepository.findById(notificationId);
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId) {
    const notification = await this.notificationRepository.findById(
      notificationId
    );

    if (!notification) {
      throw { 
        statusCode: 404, 
        message: "Notification not found" 
      };
    }

    await this.notificationRepository.deleteById(notificationId);
  }

  /**
   * Delete old notifications (cleanup)
   */
  async cleanupOldNotifications(days = 30) {
    const deleted = await this.notificationRepository.deleteOldNotifications(days);
    return { 
      message: `Deleted notifications older than ${days} days`,
      deletedCount: deleted
    };
  }

  /**
   * Broadcast notification to all users (for system alerts, features, etc.)
   * @param {string} type - notification type
   * @param {object} data - notification data including optional message
   * @param {object} deliveryMeta - delivery channels
   */
  async broadcastToAllUsers(type, data = {}, deliveryMeta = {}) {
    if (!type) {
      throw { 
        statusCode: 400, 
        message: "type is required" 
      };
    }

    const User = require('../user/user.model');
    const users = await User.findAll({
      attributes: ['id'],
      where: { isVerified: true }
    });

    // Generate message based on type if not provided
    const notificationData = {
      ...data,
      message: data.message || this.generateBroadcastMessage(type, data)
    };

    const notificationIds = [];
    for (const user of users) {
      const notification = await this.notificationRepository.create({
        user_id: user.id,
        type,
        data: notificationData,
        delivery_meta: deliveryMeta
      });
      notificationIds.push(notification.id);
    }

    return { 
      message: `Notification broadcasted to ${notificationIds.length} users`,
      broadcastCount: notificationIds.length,
      notificationIds
    };
  }

  /**
   * Broadcast notification to multiple specific users
   * @param {array} userIds - array of user IDs
   * @param {string} type - notification type
   * @param {object} data - notification data including optional message
   * @param {object} deliveryMeta - delivery channels
   */
  async broadcastToUsers(userIds, type, data = {}, deliveryMeta = {}) {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw { 
        statusCode: 400, 
        message: "userIds must be a non-empty array" 
      };
    }

    if (!type) {
      throw { 
        statusCode: 400, 
        message: "type is required" 
      };
    }

    // Generate message based on type if not provided
    const notificationData = {
      ...data,
      message: data.message || this.generateBroadcastMessage(type, data)
    };

    const notificationIds = [];
    for (const userId of userIds) {
      const notification = await this.notificationRepository.create({
        user_id: userId,
        type,
        data: notificationData,
        delivery_meta: deliveryMeta
      });
      notificationIds.push(notification.id);
    }

    return { 
      message: `Notification sent to ${notificationIds.length} users`,
      broadcastCount: notificationIds.length,
      notificationIds
    };
  }

  /**
   * Generate appropriate message based on notification type and data
   * @private
   */
  generateBroadcastMessage(type, data = {}) {
    const messages = {
      'new_feature': `New Feature: ${data.feature_name || 'A new feature has been added to the platform'}`,
      'feature_update': `Feature Update: ${data.feature_name || 'A feature has been updated'}`,
      'system_alert': `System Alert: ${data.alert_content || 'An important system update'}`,
      'maintenance': `Maintenance: ${data.maintenance_info || 'Scheduled maintenance is in progress'}`,
      'bug_fix': `Bug Fix: ${data.bug_info || 'A critical bug has been fixed'}`,
      'security_update': `Security Update: ${data.security_info || 'Security improvements have been applied'}`,
      'announcement': `Announcement: ${data.announcement || 'Important announcement from the team'}`,
      'promotion': `Promotion: ${data.promo_info || 'Check out our latest promotion'}`,
      'beta_release': `Beta Release: ${data.beta_info || 'New beta features are now available'}`,
      'performance': `Performance: ${data.perf_info || 'Platform performance has been improved'}`
    };

    return messages[type] || `${type}: ${data.content || 'New notification from the platform'}`;
  }
}
module.exports = NotificationService;