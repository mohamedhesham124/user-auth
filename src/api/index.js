const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth.route');
const userRoutes = require('./user/user.route');
const profileRoutes = require('./profile/profile.route');
const teamRoutes = require('./team/team.route');
const roleRoutes = require('./role/role.route');
const permissionRoutes = require('./permission/permission.route');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/profile', profileRoutes);
router.use('/team', teamRoutes);
router.use('/role', roleRoutes);
router.use('/permission', permissionRoutes);

module.exports = router;