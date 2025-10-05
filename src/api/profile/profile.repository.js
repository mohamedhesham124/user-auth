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
    const profile = await this.findByUserId(id);
    return await Profile.findByPk(profile.id, {
      include: [{
        association: 'user',
        attributes: ['id', 'name', 'email', 'role']
      }]
    });
  }

  async updateByProifleId(id, updateData) {
    const profile = await this.findByUserId(id);
    //console.log(profile.id)
    const [affectedCount] = await Profile.update(updateData, { 
      where: { id: profile.id } 
    });
    return {count: (affectedCount > 0), profileId: profile.id};
  }

  async deleteByProfileId(id) {
    const profile = await this.findByUserId(id);
    return await Profile.destroy({ where: { id: profile.id } });
  }

  async userHasProfile(userId) {
    const profile = await this.findByUserId(userId);
    return !!profile;
  }
}

module.exports = new ProfileRepository();