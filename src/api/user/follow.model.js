const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./user.model');

const Follow = sequelize.define('Follow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  follower_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  followee_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'follows',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['follower_id', 'followee_id']
    }
  ]
});

// Association with User
Follow.belongsTo(User, {
  foreignKey: 'follower_id',
  as: 'follower'
});

Follow.belongsTo(User, {
  foreignKey: 'followee_id',
  as: 'followee'
});

module.exports = Follow;
