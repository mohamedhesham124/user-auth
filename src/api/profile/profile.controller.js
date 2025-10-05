const asyncFun = require('../../middlewares/async.handler');
const profileService = require('./profile.service');
const { success, fail } = require('../../utils/ApiResponse');


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
   * Get profile by ID
   */
  getProfileById = asyncFun(async (req, res) => {
    const profile = await profileService.getProfileById(req.params.id);
    return success(res, "Profile fetched successfully", profile);
  });

  /**
   * Update profile by ID
   */
  updateProfileById = asyncFun(async (req, res) => {
    //console.log(req.params.id)
    const profile = await profileService.updateProfileById(req.params.id, req.body);
    return success(res, "Profile updated successfully", profile);
  });

  /**
   * Delete profile by ID
   */
  deleteProfileById = asyncFun(async (req, res) => {
    const result = await profileService.deleteProfileById(req.params.id);
    return success(res, result.message, null, 204);
  });

  /**
   * Change user password
   */
  changePassword = asyncFun(async (req, res) => {
    const passwords = req.body;
    //console.log(passwords)
    const result = await profileService.changePassword(req.user.id, passwords, req.user.email);
    return success(res, result.message);
  });

  /**
  * Upload and change profile picture
  */
  uploadProfilePicture = asyncFun(async (req, res) => {
    if (!req.file) return fail(res, "No file uploaded")

    const profile = await profileService.changeProfilePicture(req.user.id, req.file.filename);
      return success(res, "Profile picture updated successfully", profile);
  });
}

module.exports = new ProfileController();