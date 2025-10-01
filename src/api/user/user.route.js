const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { validateAuth, restrictTo } = require('../../middlewares/auth.middleware');

// Note: The base path will be /api/v1/users/ as defined in the main router

// GET /api/v1/users/ -> Get all users (Admin only)
router.get("/", validateAuth, restrictTo("Admin"), userController.getAllUsers);

// GET /api/v1/users/:id -> Get a single user by ID (Admin or the user themselves)
router.get("/:id", validateAuth, restrictTo("Admin", "User"), userController.getUserById);

// PUT /api/v1/users/:id -> Update a user (Only the user themselves)
router.put("/:id", validateAuth, restrictTo("User"), userController.updateUser);

// DELETE /api/v1/users/:id -> Delete a user (Admin or the user themselves)
router.delete("/:id", validateAuth, restrictTo("Admin", "User"), userController.deleteUser);

module.exports = router;