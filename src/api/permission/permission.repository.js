const Permission = require("./permission.model");

class PermissionRepository {
  async create(permissionData) {
    return await Permission.create(permissionData);
  }

  async findAll() {
    return await Permission.findAll();
  }

  async findById(perm_id) {
    return await Permission.findByPk(perm_id);
  }

  async findByName(name) {
    return await Permission.findOne({ where: { name } });
  }

  async updateById(perm_id, updateData) {
    const [affectedCount] = await Permission.update(updateData, { 
      where: { perm_id } 
    });
    return affectedCount > 0;
  }

  async deleteById(perm_id) {
    return await Permission.destroy({ where: { perm_id } });
  }
}

module.exports = new PermissionRepository();