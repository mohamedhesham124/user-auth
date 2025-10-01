const jwt = require('jsonwebtoken');
const asyncFun = require('./async.handler');
const UserRepository = require('../api/user/user.repository');
const response = require('../utils/ApiResponse');

const userRepository = UserRepository;

/**
 * Middleware to validate the JWT token.
 * It also checks if the user's email is verified.
 */
exports.validateAuth = asyncFun(async (req, res, next) => {
    const token = req.headers['x-auth-token'];
    if (!token) return response.fail(res, "Access denied. No token provided.", [], 401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userRepository.findById(decoded.userId);
        if (!user) return response.fail(res, "User not found for this token.", [], 404);
        
        // Security check: ensure user is verified before allowing access
        if (!user.isVerified) {
            return response.fail(res, "Please verify your email to access this route.", [], 403);
        }

        req.user = user; // Attach user object to the request
        next();
    } catch (error) {
        return response.fail(res, "Invalid or expired token.", [], 401);
    }
});

/**
 * Middleware for Role-Based Access Control (RBAC).
 * @param {...string} roles - The roles allowed to access the route (e.g., "Admin", "User").
 */
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // Rule 1: Allow a user to access/modify their own resource
        if (roles.includes("User") && req.user.id === req.params.id) {
            return next();
        }

        // Rule 2: Check if the user's role is in the list of allowed roles
        if (!roles.includes(req.user.role)) {
            return response.fail(res, "You do not have permission to perform this action.", [], 403);
        }
        
        next();
    };
};