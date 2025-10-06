const asyncFun = require('../../middlewares/async.handler');
const permissionService = require('./permission.service');
const { success } = require('../../utils/ApiResponse');

class PermissionController {
    createPermission = asyncFun(async (req, res) => {
        const permission = await permissionService.createPermission(req.body);
        return success(res, "Permission created successfully", permission, 201);
    });

    getPermissionById = asyncFun(async (req, res) => {
        const permission = await permissionService.getPermissionById(req.params.perm_id);
        return success(res, "Permission fetched successfully", permission);
    });

    updatePermission = asyncFun(async (req, res) => {
        const permission = await permissionService.updatePermission(req.params.perm_id, req.body);
        return success(res, "Permission updated successfully", permission);
    });

    deletePermission = asyncFun(async (req, res) => {
        const result = await permissionService.deletePermission(req.params.perm_id);
        return success(res, result.message, null, 204);
    });
}

module.exports = new PermissionController();