const TeamRepository = require('./team.repository');
const UserRepository = require('../user/user.repository');
const RoleRepository = require('../role/role.repository');

class TeamService {
  constructor() {
    this.teamRepository = TeamRepository;
    this.userRepository = UserRepository;
    this.roleRepository = RoleRepository;
  }

  async checkUserPermission(team_id, user_id, permission_name) {
    const teamMember = await this.teamRepository.getUserRoleInTeam(team_id, user_id);
    if (!teamMember) {
      throw { statusCode: 403, message: "You are not a member of this team" };
    }

    const userPermissions = teamMember.role.Permissions || [];
    const hasPermission = userPermissions.some(perm => perm.name === permission_name);
    
    if (!hasPermission) {
      throw { statusCode: 403, message: `You don't have permission to ${permission_name}` };
    }

    return teamMember;
  }

  async createTeam(teamData, created_by) {
    const team = await this.teamRepository.create(teamData);

    // Add creator as team member with default role (role_id = 1 for Owner)
    await this.teamRepository.addMember(team.team_id, created_by, 1);
    
    return await this.teamRepository.findById(team.team_id);
  }

  async getAllTeams() {
    return await this.teamRepository.findAll();
  }

  async getTeamById(team_id, user_id) {
    await this.checkUserPermission(team_id, user_id, 'team_view');
    
    const team = await this.teamRepository.findById(team_id);
    if (!team) {
      throw { statusCode: 404, message: "Team not found" };
    }
    return team;
  }

  async updateTeam(team_id, updateData, user_id) {
    await this.checkUserPermission(team_id, user_id, 'team_update');

    const updated = await this.teamRepository.updateById(team_id, updateData);
    if (!updated) {
      throw { statusCode: 404, message: "Team not found" };
    }
    return await this.teamRepository.findById(team_id);
  }

  async deleteTeam(team_id, user_id) {
    await this.checkUserPermission(team_id, user_id, 'team_delete');

    const deleted = await this.teamRepository.deleteById(team_id);
    if (!deleted) {
      throw { statusCode: 404, message: "Team not found" };
    }
    return { message: "Team deleted successfully" };
  }

  async addMemberToTeam(team_id, user_id, role_id, requester_id) {
    await this.checkUserPermission(team_id, requester_id, 'member_add');

    const team = await this.teamRepository.findById(team_id);
    if (!team) {
      throw { statusCode: 404, message: "Team not found" };
    }

    const targetUser = await this.userRepository.findById(user_id);
    if (!targetUser) {
      throw { statusCode: 404, message: "User not found" };
    }

    const isMember = await this.teamRepository.isUserInTeam(team_id, user_id);
    if (isMember) {
      throw { statusCode: 409, message: "User is already a member of this team" };
    }

    return await this.teamRepository.addMember(team_id, user_id, role_id);
  }

  async removeMemberFromTeam(team_id, user_id, requester_id) {
    await this.checkUserPermission(team_id, requester_id, 'member_remove');

    const removed = await this.teamRepository.removeMember(team_id, user_id);
    if (!removed) {
      throw { statusCode: 404, message: "Member not found in team" };
    }
    return { message: "Member removed from team successfully" };
  }

  async updateMemberRole(team_id, user_id, role_id, requester_id) {
    await this.checkUserPermission(team_id, requester_id, 'member_role_update');

    const updated = await this.teamRepository.updateMemberRole(team_id, user_id, role_id);
    if (!updated) {
      throw { statusCode: 404, message: "Member not found in team" };
    }
    return { message: "Member role updated successfully" };
  }

  async getTeamMembers(team_id, user_id) {
    await this.checkUserPermission(team_id, user_id, 'team_view');
    
    const team = await this.teamRepository.findById(team_id);
    if (!team) {
      throw { statusCode: 404, message: "Team not found" };
    }
    return await this.teamRepository.getTeamMembers(team_id);
  }
}

module.exports = TeamService;