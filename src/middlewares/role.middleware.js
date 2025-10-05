const asyncFun = require('./async.handler');
const response = require('../utils/ApiResponse');

/**
 * Middleware that allows:
 * - Admins to access any resource
 * - Users to access only their own resources (where :id matches their user.id)
 */
exports.roleCheck = asyncFun(async (req, res, next) => {

    // Admin can access everything
    if (req.user.role === 'Admin') {
        return next();
    }

    // User can only access their own data
    if (req.user.id === req.params.id) {
        return next();
    }

    // If neither condition is met, deny access
    return response.fail(res, "Access denied. You can only access your own data.", [], 403);
});