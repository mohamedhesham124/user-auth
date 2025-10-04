const ProfileRepository = require('./profile.repository');
const UserRepository = require('../user/user.repository');

class ProfileService {
  constructor() {
    this.profileRepository = ProfileRepository;
    this.userRepository = UserRepository;
  }

  async createProfile(userId, profileData) {
    // Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw { statusCode: 404, message: "User not found" };
    }

    // Check if profile already exists
    const existingProfile = await this.profileRepository.findByUserId(userId);
    if (existingProfile) {
      throw { statusCode: 409, message: "Profile already exists for this user" };
    }

    // Create profile
    const profile = await this.profileRepository.create({
      userId,
      ...profileData
    });

    return await this.profileRepository.findByUserId(userId);
  }

  async getProfile(userId) {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw { statusCode: 404, message: "Profile not found" };
    }
    return profile;
  }

  async getProfileById(profileId) {
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      throw { statusCode: 404, message: "Profile not found" };
    }
    return profile;
  }

  async updateProfile(userId, updateData) {
    // Check if profile exists
    const existingProfile = await this.profileRepository.findByUserId(userId);
    if (!existingProfile) {
      throw { statusCode: 404, message: "Profile not found" };
    }

    // Update profile
    const updated = await this.profileRepository.updateByUserId(userId, updateData);
    if (!updated) {
      throw { statusCode: 500, message: "Failed to update profile" };
    }

    return await this.profileRepository.findByUserId(userId);
  }

  async updateProfileById(profileId, updateData) {
    const updated = await this.profileRepository.updateByProifleId(profileId, updateData);
    if (!updated) {
      throw { statusCode: 404, message: "Profile not found" };
    }

    return await this.profileRepository.findById(profileId);
  }

  async deleteProfile(userId) {
    const deleted = await this.profileRepository.deleteByUserId(userId);
    if (!deleted) {
      throw { statusCode: 404, message: "Profile not found" };
    }
    return { message: "Profile deleted successfully" };
  }

  async deleteProfileById(profileId) {
    const deleted = await this.profileRepository.deleteByProfileId(profileId);
    if (!deleted) {
      throw { statusCode: 404, message: "Profile not found" };
    }
    return { message: "Profile deleted successfully" };
  }
}

module.exports = new ProfileService();