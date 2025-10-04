const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth.route');
const userRoutes = require('./user/user.route');
const profileRoutes = require('./profile/profile.route');

// All auth-related routes will be prefixed with /auth
router.use('/auth', authRoutes);

// All user-related routes will be prefixed with /user
router.use('/user', userRoutes);

// All profile-related routes will be prefixed with /profile
router.use('/profile', profileRoutes);

module.exports = router;