const PermissionRepository = require('./permission.repository');

class PermissionService {
  constructor() {
    this.permissionRepository = PermissionRepository;
  }

  async createPermission(permissionData) {
    const existingPermission = await this.permissionRepository.findByName(permissionData.name);
    if (existingPermission) {
      throw { statusCode: 409, message: "Permission already exists" };
    }
    return await this.permissionRepository.create(permissionData);
  }

  async getPermissionById(perm_id) {
    const permission = await this.permissionRepository.findById(perm_id);
    if (!permission) {
      throw { statusCode: 404, message: "Permission not found" };
    }
    return permission;
  }

  async updatePermission(perm_id, updateData) {
    if (updateData.name) {
      const existingPermission = await this.permissionRepository.findByName(updateData.name);
      if (existingPermission && existingPermission.perm_id != perm_id) {
        throw { statusCode: 409, message: "Permission name already exists" };
      }
    }

    const updated = await this.permissionRepository.updateById(perm_id, updateData);
    if (!updated) {
      throw { statusCode: 404, message: "Permission not found" };
    }
    return await this.permissionRepository.findById(perm_id);
  }

  async deletePermission(perm_id) {
    const deleted = await this.permissionRepository.deleteById(perm_id);
    if (!deleted) {
      throw { statusCode: 404, message: "Permission not found" };
    }
    return { message: "Permission deleted successfully" };
  }
}

module.exports = new PermissionService();