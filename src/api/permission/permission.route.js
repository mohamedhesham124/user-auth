const express = require("express");
const router = express.Router();
const permissionController = require("./permission.controller");
const { validateAuth, restrictTo } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate');
const { createPermissionSchema, updatePermissionSchema } = require("./permission.validation");

// All routes require Admin authentication
router.use(validateAuth, restrictTo("Admin"));

router.post("/", validate(createPermissionSchema), permissionController.createPermission);
router.get("/:perm_id", permissionController.getPermissionById);
router.put("/:perm_id", validate(updatePermissionSchema), permissionController.updatePermission);
router.delete("/:perm_id", permissionController.deletePermission);

module.exports = router;