const express = require("express");
const router = express.Router();
const roleController = require("./role.controller");
const { validateAuth, restrictTo } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate');
const { createRoleSchema, updateRoleSchema, addPermissionSchema } = require("./role.validation");

// All routes require Admin authentication
router.use(validateAuth, restrictTo("Admin"));

router.post("/", validate(createRoleSchema), roleController.createRole);
router.get("/:role_id", roleController.getRoleById);
router.put("/:role_id", validate(updateRoleSchema), roleController.updateRole);
router.delete("/:role_id", roleController.deleteRole);

// Role Permissions Management
router.post("/:role_id/permissions", validate(addPermissionSchema), roleController.addPermissionToRole);
router.delete("/:role_id/permissions/:perm_id", roleController.removePermissionFromRole);

module.exports = router;