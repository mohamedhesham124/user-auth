const ProfileRepository = require('./profile.repository');
const UserRepository = require('../user/user.repository');
const bcryptUtil = require('../../utils/bcrypt');

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

  async getProfileById(userId) {
    const profile = await this.profileRepository.findById(userId);
    if (!profile) {
      throw { statusCode: 404, message: "Profile not found" };
    }
    return profile;
  }

  async updateProfileById(userId, updateData) {
    const result = await this.profileRepository.updateByProifleId(userId, updateData);
    //console.log(updated)
    if (!result.count) {
      throw { statusCode: 404, message: "Error in updating" };
    }

    return await this.profileRepository.findById(result.profileId);
  }

  async deleteProfileById(userId) {
    const deleted = await this.profileRepository.deleteByProfileId(userId);
    if (!deleted) {
      throw { statusCode: 404, message: "Profile not found" };
    }
    return { message: "Profile deleted successfully" };
  }

  async changePassword(userId, passwords, email) {
    // Compare two passwords

    if (passwords.newPassword!==passwords.confirmPassword) {
        throw { statusCode: 404, message: "password and confirm aren't same" };
    }

    // Hash new password and update
    const hashedNewPassword = await bcryptUtil.hashPassword(passwords.newPassword);
    await this.userRepository.updatePassword(userId, hashedNewPassword);

    return { message: "Password changed successfully" };
  }

  async changeProfilePicture(userId, profilePictureUrl) {
    const updated = await this.profileRepository.updateByProifleId(userId, {
        profilePicture: profilePictureUrl
    });
    
    if (!updated) {
        throw { statusCode: 404, message: "Profile not found" };
    }

    return await this.profileRepository.findByUserId(userId);
  }
}

module.exports = new ProfileService();