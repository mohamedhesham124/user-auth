const asyncFun = require('./async.handler');
const response = require('../utils/ApiResponse');
const TeamRepository = require('../api/team/team.repository');

const teamRepository = TeamRepository;

/**
 * Middleware to check if user has specific permission in a team
 */
exports.checkTeamPermission = (permission_name) => {
    return asyncFun(async (req, res, next) => {
        const team_id = req.params.team_id;
        const user_id = req.user.id;

        if (!team_id) {
            return response.fail(res, "Team ID is required", [], 400);
        }

        // Get user's role and permissions in the team
        const teamMember = await teamRepository.getUserRoleInTeam(team_id, user_id);
        if (!teamMember) {
            return response.fail(res, "You are not a member of this team", [], 403);
        }

        // Check if user has the required permission
        const userPermissions = teamMember.role.Permissions || [];
        const hasPermission = userPermissions.some(perm => perm.name === permission_name);
        
        if (!hasPermission) {
            return response.fail(res, `You don't have permission to ${permission_name}`, [], 403);
        }

        next();
    });
};