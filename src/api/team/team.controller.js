const asyncFun = require('../../middlewares/async.handler');
const TeamService = require('./team.service');
const { success } = require('../../utils/ApiResponse');

const teamService = new TeamService();

class TeamController {
    createTeam = asyncFun(async (req, res) => {
        const team = await teamService.createTeam(req.body, req.user.id);
        return success(res, "Team created successfully", team, 201);
    });

    getAllTeams = asyncFun(async (req, res) => {
        const teams = await teamService.getAllTeams();
        return success(res, "Teams fetched successfully", teams);
    });

    getTeamById = asyncFun(async (req, res) => {
        const team = await teamService.getTeamById(req.params.team_id);
        return success(res, "Team fetched successfully", team);
    });

    updateTeam = asyncFun(async (req, res) => {
        const team = await teamService.updateTeam(req.params.team_id, req.body);
        return success(res, "Team updated successfully", team);
    });

    deleteTeam = asyncFun(async (req, res) => {
        const result = await teamService.deleteTeam(req.params.team_id);
        return success(res, result.message, null, 204);
    });

    addMember = asyncFun(async (req, res) => {
        const { team_id } = req.params;
        const { user_id, role_id } = req.body;
        const member = await teamService.addMemberToTeam(team_id, user_id, role_id);
        return success(res, "Member added to team successfully", member, 201);
    });

    removeMember = asyncFun(async (req, res) => {
        const { team_id, user_id } = req.params;
        const result = await teamService.removeMemberFromTeam(team_id, user_id);
        return success(res, result.message, null, 204);
    });

    updateMemberRole = asyncFun(async (req, res) => {
        const { team_id, user_id } = req.params;
        const { role_id } = req.body;
        const result = await teamService.updateMemberRole(team_id, user_id, role_id);
        return success(res, result.message);
    });

    getTeamMembers = asyncFun(async (req, res) => {
        const members = await teamService.getTeamMembers(req.params.team_id);
        return success(res, "Team members fetched successfully", members);
    });
}

module.exports = new TeamController();