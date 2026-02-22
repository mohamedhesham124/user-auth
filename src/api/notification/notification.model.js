const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../user/user.model');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    // 'e.g., new_follower, message, system_alert'
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    // 'Raw data needed to build the notification message'
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true,
    // 'Timestamp when notification was read. Null if unread.'
  },
  delivery_meta: {
    type: DataTypes.JSON,
    defaultValue: {},
    // 'Delivery status for different channels: {email, push, sms, etc}'
  }
}, {
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Association with User
Notification.belongsTo(User, { 
  foreignKey: 'user_id',
  as: 'user'
});

module.exports = Notification;
