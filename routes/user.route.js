// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const validate = require('../middlewares/validate');
const { signupSchema, signinSchema, changePasswordSchema } = require("../validators/authValidator");

// register
router.post("/signup", validate(signupSchema), authController.signup);
router.post("/signin", validate(signinSchema), authController.signin);

router.get("/verify-email", authController.verifyEmail);

// password
router.post("/forget-password", authController.forgetPassword);
router.get("/reset-password", authController.showResetPasswordForm);
router.post("/change-password",validate(changePasswordSchema),
authController.changePassword
);

// user management
router.get("/", authController.validateAuth, authController.restrictTo("Admin"), UserController.getAllUsers);
router.get("/:id", authController.validateAuth, authController.restrictTo("Admin","User"), UserController.getUserById);
router.put("/:id", authController.validateAuth, authController.restrictTo("User"), UserController.updateUser);
router.delete("/:id", authController.validateAuth, authController.restrictTo("Admin","User"), UserController.deleteUser);

module.exports = router;
