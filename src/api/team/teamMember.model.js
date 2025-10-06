const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Team = require('./team.model');
const User = require('../user/user.model');
const Role = require('../role/role.model');

const TeamMember = sequelize.define('TeamMember', {
  team_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Team,
      key: 'team_id'
    }
  },
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: 'role_id'
    }
  }
}, {
  tableName: 'teammembers',
  timestamps: false
});

// Associations
Team.belongsToMany(User, { 
  through: TeamMember, 
  foreignKey: 'team_id', 
  otherKey: 'user_id',
  as: 'members'
});

User.belongsToMany(Team, { 
  through: TeamMember, 
  foreignKey: 'user_id', 
  otherKey: 'team_id',
  as: 'teams'
});

TeamMember.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
TeamMember.belongsTo(Team, { foreignKey: 'team_id', as: 'team' });
TeamMember.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = TeamMember;