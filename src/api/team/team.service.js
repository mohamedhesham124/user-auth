const TeamRepository = require('./team.repository');
const UserRepository = require('../user/user.repository');
const RoleRepository = require('../role/role.repository');

class TeamService {
  constructor() {
    this.teamRepository = TeamRepository;
    this.userRepository = UserRepository;
    this.roleRepository = RoleRepository;
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

  async getTeamById(team_id) {
    const team = await this.teamRepository.findById(team_id);

    if (!team) {
      throw { statusCode: 404, message: "Team not found" };
    }
    return team;
  }

  async updateTeam(team_id, updateData) {
    const updated = await this.teamRepository.updateById(team_id, updateData);

    if (!updated) {
      throw { statusCode: 404, message: "Team not found" };
    }
    return await this.teamRepository.findById(team_id);
  }

  async deleteTeam(team_id) {
    const deleted = await this.teamRepository.deleteById(team_id);

    if (!deleted) {
      throw { statusCode: 404, message: "Team not found" };
    }
    return { message: "Team deleted successfully" };
  }

  async addMemberToTeam(team_id, user_id, role_id) {
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

  async removeMemberFromTeam(team_id, user_id) {
    const removed = await this.teamRepository.removeMember(team_id, user_id);

    if (!removed) {
      throw { statusCode: 404, message: "Member not found in team" };
    }
    return { message: "Member removed from team successfully" };
  }

  async updateMemberRole(team_id, user_id, role_id) {
    const updated = await this.teamRepository.updateMemberRole(team_id, user_id, role_id);

    if (!updated) {
      throw { statusCode: 404, message: "Member not found in team" };
    }
    return { message: "Member role updated successfully" };
  }

  async getTeamMembers(team_id) {    
    const team = await this.teamRepository.findById(team_id);

    if (!team) {
      throw { statusCode: 404, message: "Team not found" };
    }
    return await this.teamRepository.getTeamMembers(team_id);
  }
}

module.exports = TeamService;