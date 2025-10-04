const express = require("express");
const router = express.Router();
const profileController = require("./profile.controller");
const { validateAuth, restrictTo } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate');
const { createProfileSchema, updateProfileSchema } = require("./profile.validation");

// All routes require authentication
router.use(validateAuth);

// User profile routes
router.post("/", validate(createProfileSchema), profileController.createProfile);
router.get("/me", profileController.getMyProfile);
router.post("/me", validate(updateProfileSchema), profileController.updateMyProfile);
router.delete("/me", profileController.deleteMyProfile);

// Admin only routes
router.get("/:id", restrictTo("Admin"), profileController.getProfileById);
router.post("/:id", restrictTo("Admin"), validate(updateProfileSchema), profileController.updateProfileById);
router.delete("/:id", restrictTo("Admin"), profileController.deleteProfileById);

module.exports = router;