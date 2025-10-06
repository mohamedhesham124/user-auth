const asyncFun = require('../../middlewares/async.handler');
const RoleService = require('./role.service');
const { success } = require('../../utils/ApiResponse');

const roleService = new RoleService();

class RoleController {
    createRole = asyncFun(async (req, res) => {
        const role = await roleService.createRole(req.body);
        return success(res, "Role created successfully", role, 201);
    });

    getAllRoles = asyncFun(async (req, res) => {
        const roles = await roleService.getAllRoles();
        return success(res, "Roles fetched successfully", roles);
    });

    getRoleById = asyncFun(async (req, res) => {
        const role = await roleService.getRoleById(req.params.role_id);
        return success(res, "Role fetched successfully", role);
    });

    updateRole = asyncFun(async (req, res) => {
        const role = await roleService.updateRole(req.params.role_id, req.body);
        return success(res, "Role updated successfully", role);
    });

    deleteRole = asyncFun(async (req, res) => {
        const result = await roleService.deleteRole(req.params.role_id);
        return success(res, result.message, null, 204);
    });

    addPermissionToRole = asyncFun(async (req, res) => {
        const { role_id } = req.params;
        const { perm_id } = req.body;
        const result = await roleService.addPermissionToRole(role_id, perm_id);
        return success(res, result.message);
    });

    removePermissionFromRole = asyncFun(async (req, res) => {
        const { role_id, perm_id } = req.params;
        const result = await roleService.removePermissionFromRole(role_id, perm_id);
        return success(res, result.message);
    });
}

module.exports = new RoleController();