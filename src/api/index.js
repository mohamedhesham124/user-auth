const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth.route');
const userRoutes = require('./user/user.route');

// All auth-related routes will be prefixed with /auth
router.use('/auth', authRoutes);

// All user-related routes will be prefixed with /users
router.use('/user', userRoutes);

module.exports = router;