const Profile = require("./profile.model");

class ProfileRepository {
  async create(profileData) {
    return await Profile.create(profileData);
  }

  async findByUserId(userId) {
    return await Profile.findOne({ 
      where: { userId },
      include: [{
        association: 'user',
        attributes: ['id', 'name', 'email', 'role']
      }]
    });
  }

  async findById(id) {
    return await Profile.findByPk(id, {
      include: [{
        association: 'user',
        attributes: ['id', 'name', 'email', 'role']
      }]
    });
  }

  async updateByUserId(userId, updateData) {
    const [affectedCount] = await Profile.update(updateData, { 
      where: { userId } 
    });
    return affectedCount > 0;
  }

  async updateByProifleId(id, updateData) {
    const [affectedCount] = await Profile.update(updateData, { 
      where: { id } 
    });
    return affectedCount > 0;
  }

  async deleteByUserId(userId) {
    return await Profile.destroy({ where: { userId } });
  }

  async deleteByProfileId(id) {
    return await Profile.destroy({ where: { id } });
  }

  async userHasProfile(userId) {
    const profile = await this.findByUserId(userId);
    return !!profile;
  }
}

module.exports = new ProfileRepository();