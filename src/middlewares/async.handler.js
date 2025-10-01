const { fail } = require('../utils/ApiResponse');

/**
 * A middleware that wraps async route handlers to catch errors.
 * It uses the ApiResponse utility to send consistent, formatted error responses.
 */
const asyncHandler = (handler) => {
    return async (req, res, next) => {
        try {
            // Execute the actual controller logic
            await handler(req, res, next);
        } catch (error) {
            // Log the error for debugging
            console.error("Error caught by asyncHandler:", error);

            // Check if it's a custom error object we threw from a service
            // (e.g., { statusCode: 409, message: "..." })
            if (error.statusCode) {
                // If so, use our custom 'fail' response handler
                return fail(res, error.message, [], error.statusCode);
            }

            // If it's not a custom error, it's an unexpected server error.
            // In this case, we can let our global error handler deal with it.
            next(error);
        }
    };
};

module.exports = asyncHandler;