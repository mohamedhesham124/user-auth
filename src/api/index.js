const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth.route');
const userRoutes = require('./user/user.route');
const profileRoutes = require('./profile/profile.route');
const teamRoutes = require('./team/team.route');
const roleRoutes = require('./role/role.route');
const permissionRoutes = require('./permission/permission.route');
const fileRoutes = require('./file/file.route');
const processRoutes = require('./process/process.route');
const notificationRoutes = require('./notification/notification.route');


router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/profile', profileRoutes);
router.use('/team', teamRoutes);
router.use('/role', roleRoutes);
router.use('/permission', permissionRoutes);

// ALL file-related routes will be prefixed with /file
router.use('/file', fileRoutes);

// ALL process-file-related routes will be prefixed with /process
router.use('/process', processRoutes);

// ALL notification-related routes will be prefixed with /notification
router.use('/notification', notificationRoutes);

module.exports = router;