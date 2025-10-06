const express = require("express");
const router = express.Router();
const teamController = require("./team.controller");
const { validateAuth } = require('../../middlewares/auth.middleware');
const { checkTeamPermission } = require('../../middlewares/teamPermission.middleware');
const validate = require('../../middlewares/validate');
const { createTeamSchema, updateTeamSchema, addMemberSchema, updateMemberRoleSchema } = require("./team.validation");

// All routes require authentication
router.use(validateAuth);

// Team Endpoints
router.post("/", validate(createTeamSchema), teamController.createTeam);
router.get("/", teamController.getAllTeams);
router.get("/:team_id", checkTeamPermission('team_view'), teamController.getTeamById);
router.put("/:team_id", checkTeamPermission('team_update'), validate(updateTeamSchema), teamController.updateTeam);
router.delete("/:team_id", checkTeamPermission('team_delete'), teamController.deleteTeam);

// Team Member Management Endpoints
router.post("/:team_id/members", checkTeamPermission('member_add'), validate(addMemberSchema), teamController.addMember);
router.get("/:team_id/members", checkTeamPermission('team_view'), teamController.getTeamMembers);
router.put("/:team_id/members/:user_id/role", checkTeamPermission('member_role_update'), validate(updateMemberRoleSchema), teamController.updateMemberRole);
router.delete("/:team_id/members/:user_id", checkTeamPermission('member_remove'), teamController.removeMember);

module.exports = router;