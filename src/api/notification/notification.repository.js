const Notification = require('./notification.model');
const User = require('../user/user.model');

class NotificationRepository {
  /**
   * Create a new notification
   */
  async create(notificationData) {
    return await Notification.create(notificationData);
  }

  /**
   * Get all notifications for a user with pagination
   */
  async findByUserId(userId, limit = 20, offset = 0) {
    return await Notification.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  }

  /**
   * Get unread notifications for a user
   */
  async findUnreadByUserId(userId, limit = 20, offset = 0) {
    return await Notification.findAndCountAll({
      where: { 
        user_id: userId,
        read_at: null
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  }

  /**
   * Get notification by ID
   */
  async findById(id) {
    return await Notification.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ]
    });
  }

  /**
   * Get notifications by type
   */
  async findByType(userId, type, limit = 20, offset = 0) {
    return await Notification.findAndCountAll({
      where: { 
        user_id: userId,
        type: type
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id) {
    return await Notification.update(
      { read_at: new Date() },
      { where: { id } }
    );
  }

  /**
   * Mark multiple notifications as read
   */
  async markMultipleAsRead(notificationIds) {
    return await Notification.update(
      { read_at: new Date() },
      { where: { id: notificationIds } }
    );
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    return await Notification.update(
      { read_at: new Date() },
      { 
        where: { 
          user_id: userId,
          read_at: null
        }
      }
    );
  }

  /**
   * Update notification delivery meta
   */
  async updateDeliveryMeta(id, deliveryMeta) {
    return await Notification.update(
      { delivery_meta: deliveryMeta },
      { where: { id } }
    );
  }

  /**
   * Count unread notifications for a user
   */
  async countUnread(userId) {
    return await Notification.count({
      where: { 
        user_id: userId,
        read_at: null
      }
    });
  }

  /**
   * Delete a notification
   */
  async deleteById(id) {
    return await Notification.destroy({ where: { id } });
  }

  /**
   * Delete old notifications (older than days)
   */
  async deleteOldNotifications(days = 30) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    
    return await Notification.destroy({
      where: {
        created_at: {
          [require('sequelize').Op.lt]: date
        }
      }
    });
  }

  /**
   * Get notification count by type for a user
   */
  async countByType(userId, type) {
    return await Notification.count({
      where: { 
        user_id: userId,
        type: type
      }
    });
  }
}

module.exports = new NotificationRepository();
