const TeamRepository = require('./team.repository');
const UserRepository = require('../user/user.repository');
const RoleRepository = require('../role/role.repository');
const NotificationService = require('../notification/notification.service');

class TeamService {
  constructor() {
    this.teamRepository = TeamRepository;
    this.userRepository = UserRepository;
    this.roleRepository = RoleRepository;
    this.notificationService = new NotificationService();
  }

  async createTeam(teamData, created_by, roleName) {
    const team = await this.teamRepository.create(teamData);

    // Owner is the authenticated user who created the team
    const ownerUserId = created_by;

    // Determine role to use for the owner (frontend passes roleName as hidden input)
    const roleToUse = roleName || 'Owner';
    let ownerRole = await this.roleRepository.findByName(roleToUse);
    if (!ownerRole) {
      ownerRole = await this.roleRepository.create({ name: roleToUse });
    }

    // Add owner as a team member with the resolved role
    await this.teamRepository.addMember(team.team_id, ownerUserId, ownerRole.role_id);

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

  async addMemberToTeam(team_id, email, roleName) {
    const team = await this.teamRepository.findById(team_id);

    if (!team) {
      throw { statusCode: 404, message: "Team not found" };
    }

    const targetUser = await this.userRepository.findByEmail(email);
    if (!targetUser) {
      throw { statusCode: 404, message: "User not found" };
    }

    const user_id = targetUser.id;

    const isMember = await this.teamRepository.isUserInTeam(team_id, user_id);
    if (isMember) {
      throw { statusCode: 409, message: "User is already a member of this team" };
    }

    // Resolve role by name (frontend provides roleName). Create if missing.
    const roleToUse = roleName || 'Viewer';
    let role = await this.roleRepository.findByName(roleToUse);
    if (!role) {
      role = await this.roleRepository.create({ name: roleToUse });
    }

    const result = await this.teamRepository.addMember(team_id, user_id, role.role_id);

    // Create notification for new team member
    await this.notificationService.createNotification(
      user_id,
      'added_to_team',
      {
        team_id,
        team_name: team.name,
        team_description: team.description,
        role: roleToUse,
        message: `You have been added to the team "${team.name}"`
      },
      { email: 'pending', push: 'pending', in_app: 'delivered' }
    );

    return result;
  }

  async removeMemberFromTeam(team_id, user_id) {
    const team = await this.teamRepository.findById(team_id);

    if (!team) {
      throw { statusCode: 404, message: "Team not found" };
    }

    const removed = await this.teamRepository.removeMember(team_id, user_id);

    if (!removed) {
      throw { statusCode: 404, message: "Member not found in team" };
    }

    // Create notification for removed team member
    await this.notificationService.createNotification(
      user_id,
      'removed_from_team',
      {
        team_id,
        team_name: team.name,
        message: `You have been removed from the team "${team.name}"`
      },
      { email: 'pending', push: 'pending', in_app: 'delivered' }
    );

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