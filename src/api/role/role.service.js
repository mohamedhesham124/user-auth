const RoleRepository = require('./role.repository');
const PermissionRepository = require('../permission/permission.repository');

class RoleService {
  constructor() {
    this.roleRepository = RoleRepository;
    this.permissionRepository = PermissionRepository;
  }

  async createRole(roleData) {
    const existingRole = await this.roleRepository.findByName(roleData.name);
    if (existingRole) {
      throw { statusCode: 409, message: "Role already exists" };
    }
    return await this.roleRepository.create(roleData);
  }

  async getRoleById(role_id) {
    const role = await this.roleRepository.findById(role_id);
    if (!role) {
      throw { statusCode: 404, message: "Role not found" };
    }
    return role;
  }

  async updateRole(role_id, updateData) {
    if (updateData.name) {
      const existingRole = await this.roleRepository.findByName(updateData.name);
      if (existingRole && existingRole.role_id != role_id) {
        throw { statusCode: 409, message: "Role name already exists" };
      }
    }

    const updated = await this.roleRepository.updateById(role_id, updateData);
    if (!updated) {
      throw { statusCode: 404, message: "Role not found" };
    }
    return await this.roleRepository.findById(role_id);
  }

  async deleteRole(role_id) {
    const deleted = await this.roleRepository.deleteById(role_id);
    if (!deleted) {
      throw { statusCode: 404, message: "Role not found" };
    }
    return { message: "Role deleted successfully" };
  }

  async addPermissionToRole(role_id, perm_id) {
    const role = await this.roleRepository.findById(role_id);
    if (!role) {
      throw { statusCode: 404, message: "Role not found" };
    }

    const permission = await this.permissionRepository.findById(perm_id);
    if (!permission) {
      throw { statusCode: 404, message: "Permission not found" };
    }

    const added = await this.roleRepository.addPermissionToRole(role_id, perm_id);
    if (!added) {
      throw { statusCode: 500, message: "Failed to add permission to role" };
    }

    return { message: "Permission added to role successfully" };
  }

  async removePermissionFromRole(role_id, perm_id) {
    const removed = await this.roleRepository.removePermissionFromRole(role_id, perm_id);
    if (!removed) {
      throw { statusCode: 404, message: "Role or permission not found" };
    }
    return { message: "Permission removed from role successfully" };
  }
}

module.exports = RoleService;