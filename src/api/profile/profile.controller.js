const asyncFun = require('../../middlewares/async.handler');
const profileService = require('./profile.service');
const { success } = require('../../utils/ApiResponse');


class ProfileController {
  /**
   * Create a new profile for the authenticated user
   */
  createProfile = asyncFun(async (req, res) => {
    const profile = await profileService.createProfile(req.user.id, req.body);
    return success(res, "Profile created successfully", profile, 201);
  });

  /**
   * Get current user's profile
   */
  getMyProfile = asyncFun(async (req, res) => {
    const profile = await profileService.getProfile(req.user.id);
    return success(res, "Profile fetched successfully", profile);
  });

  /**
   * Get profile by ID (Admin only)
   */
  getProfileById = asyncFun(async (req, res) => {
    const profile = await profileService.getProfileById(req.params.id);
    return success(res, "Profile fetched successfully", profile);
  });

  /**
   * Update current user's profile
   */
  updateMyProfile = asyncFun(async (req, res) => {
    const profile = await profileService.updateProfile(req.user.id, req.body);
    return success(res, "Profile updated successfully", profile);
  });

  /**
   * Update profile by ID (Admin only)
   */
  updateProfileById = asyncFun(async (req, res) => {
    const profile = await profileService.updateProfileById(req.params.id, req.body);
    return success(res, "Profile updated successfully", profile);
  });

  /**
   * Delete current user's profile
   */
  deleteMyProfile = asyncFun(async (req, res) => {
    const result = await profileService.deleteProfile(req.user.id);
    return success(res, result.message, null, 204);
  });

  /**
   * Delete profile by ID (Admin only)
   */
  deleteProfileById = asyncFun(async (req, res) => {
    const result = await profileService.deleteProfileById(req.params.id);
    return success(res, result.message, null, 204);
  });
}

module.exports = new ProfileController();