const Role = require("./role.model");
const Permission = require("../permission/permission.model");

class RoleRepository {
  async create(roleData) {
    return await Role.create(roleData);
  }

  async findAll() {
    return await Role.findAll({
      include: [{
        model: Permission,
        through: { attributes: [] }
      }]
    });
  }

  async findById(role_id) {
    return await Role.findByPk(role_id, {
      include: [{
        model: Permission,
        through: { attributes: [] }
      }]
    });
  }

  async findByName(name) {
    return await Role.findOne({ 
      where: { name },
      include: [{
        model: Permission,
        through: { attributes: [] }
      }]
    });
  }

  async updateById(role_id, updateData) {
    const [affectedCount] = await Role.update(updateData, { 
      where: { role_id } 
    });
    return affectedCount > 0;
  }

  async deleteById(role_id) {
    return await Role.destroy({ where: { role_id } });
  }

  async addPermissionToRole(role_id, perm_id) {
    const role = await this.findById(role_id);
    const permission = await Permission.findByPk(perm_id);
    
    if (role && permission) {
      await role.addPermission(permission);
      return true;
    }
    return false;
  }

  async removePermissionFromRole(role_id, perm_id) {
    const role = await this.findById(role_id);
    const permission = await Permission.findByPk(perm_id);
    
    if (role && permission) {
      await role.removePermission(permission);
      return true;
    }
    return false;
  }
}

module.exports = new RoleRepository();