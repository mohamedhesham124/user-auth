const asyncFun = require('../../middlewares/async.handler');
const response = require('../../utils/ApiResponse');
const AuthService = require('./auth.service');

// Instantiate the service once
const authService = new AuthService();

class AuthController {
    /**
     * Handles signup request.
     * It calls the service to perform the logic and sends the response.
     */
    signup = asyncFun(async (req, res) => {
        const newUser = await authService.signup(req.body);
        return response.success(res, "Check your email to verify your account", newUser, 201);
    });

    /**
     * Handles email verification by calling the service.
     */
    verifyEmail = asyncFun(async (req, res) => {
        await authService.verifyEmail(req.query.token);
        // On success, render a view
        return res.render('email/Successful', {
            title: "Email Verified Successfully!",
            message: "You can now close this page and sign in to your account."
        });
    });

    /**
     * Handles signin request.
     */
    signin = asyncFun(async (req, res) => {
        const { email, password } = req.body;
        const { token, user } = await authService.signin(email, password);
        
        res.header('x-auth-token', token); // Set auth token in header
        return response.success(res, "Sign in successful", { token, user });
    });

    /**
     * Handles forgot password request.
     */
    forgetPassword = asyncFun(async (req, res) => {
        const { email } = req.body;
        await authService.forgetPassword(email);
        return response.success(res, "Password reset email sent successfully");
    });

    /**
     * Handles the final password change after reset.
     */
    changePassword = asyncFun(async (req, res) => {
        const { token } = req.query;
        const { password } = req.body;
        await authService.changePassword(token, password);
        
        return res.render('email/Successful', {
            title: "Password Changed Successfully!",
            message: "You can now close this page and sign in to your account."
        });
    });

    /**
     * Renders the password reset form.
     */
    showResetPasswordForm = asyncFun(async (req, res) => {
        const { token } = req.query;
        if (!token) {
            // Render a failure page if the token is missing
            return res.render('email/Failed', { 
                title: "Error", 
                message: "Invalid or missing password reset token." 
            });
        }
        const postUrl = `/api/v1/auth/change-password?token=${token}`;
        return res.render('email/resetPasswordForm', { token, postUrl });
    });
}

// Export a single instance of the controller
module.exports = new AuthController();