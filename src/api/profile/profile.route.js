const express = require("express");
const router = express.Router();
const profileController = require("./profile.controller");
const { roleCheck } = require('../../middlewares/role.middleware'); // NEW
const { validateAuth } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate');
const { createProfileSchema, updateProfileSchema, changePasswordSchema, changeProfilePictureSchema } = require("./profile.validation");
const { uploadProfilePicture, handleUploadError } = require('../../middlewares/upload.middleware');

// All routes require authentication
router.use(validateAuth);

// create profile of the user
router.post("/", validate(createProfileSchema), profileController.createProfile);

// get own profile
router.get("/me", profileController.getMyProfile);

// based on admin or profile owner
router.get("/:id", roleCheck, profileController.getProfileById);
router.post("/:id", roleCheck, validate(updateProfileSchema), profileController.updateProfileById);
router.delete("/:id", roleCheck, profileController.deleteProfileById);
router.put("/:id/password", roleCheck, validate(changePasswordSchema), profileController.changePassword);

// uploads any user's profile picture
router.post("/:id/profile-picture", roleCheck, uploadProfilePicture, handleUploadError, profileController.uploadProfilePicture);

module.exports = router;