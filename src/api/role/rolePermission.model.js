const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Role = require('./role.model');
const Permission = require('../permission/permission.model');

const RolePermission = sequelize.define('RolePermission', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Role,
      key: 'role_id'
    }
  },
  perm_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Permission,
      key: 'perm_id'
    }
  }
}, {
  tableName: 'rolepermissions',
  timestamps: false
});

// Associations
Role.belongsToMany(Permission, { 
  through: RolePermission, 
  foreignKey: 'role_id', 
  otherKey: 'perm_id' 
});

Permission.belongsToMany(Role, { 
  through: RolePermission, 
  foreignKey: 'perm_id', 
  otherKey: 'role_id' 
});

module.exports = RolePermission;