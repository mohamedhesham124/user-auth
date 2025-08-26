const jwt = require('jsonwebtoken');  
const mailService = require('../utils/mail.service');
const bcrypt = require('../utils/bcrypt');
const asyncFun = require('../middlewares/async.function');
const User = require('../repositories/userRepository');
const response = require('../utils/response');
const { render } = require('ejs');

// Helper function to sign JWT tokens
const signToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

class authController {
    // Signup handler
    static signup = asyncFun(async (req, res) => {
        const { email, password } = req.body;

        const isExist = await User.findByEmail(email);
        if (isExist) return response.fail(res, "Email already exists");

        req.body.password = await bcrypt.hashPassword(password);
        const newUser = await User.create(req.body);

        const mailer = new mailService();
        const verificationToken = signToken(newUser.id);
        const verificationLink = `${process.env.URL}/api/v1/user/verify-email?token=${verificationToken}`;
        
        await mailer.sendVerificationEmail(email, verificationLink);

        return response.success(res, "Check your email to verify your account", newUser, 201);
    });

    // Email verification handler
    static verifyEmail = asyncFun(async (req, res) => {
        try {
            const { token } = req.query;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;
            await User.verifyEmail(userId);

            return res.render('email/Succsseful', {
                    title: "Email Verified Successfully!",
                    message: "You can now close this page and sign in to your account."
                });
        } catch (error) {
            res.render('email/Failed', {
                title: "Email Verification Failed",
                message: "The verification link is invalid or expired."
            });
        }
    });

    // Sign-in handler
    static signin = asyncFun(async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) return response.fail(res, "Invalid credentials");

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return response.fail(res, "Invalid credentials");

        const token = signToken(user.id, user.role);
        res.header('x-auth-token', token);

        return response.success(res, "Sign in successful", { token, user });
    });

    // Forgot password handler
    static forgetPassword = asyncFun(async (req, res) => {
        if(!req.body.email) return response.fail(res , "Email not found");
        const { email } = req.body;
        const user = await User.findByEmail(email);
        if (!user) return response.fail(res, "User not found");

        const resetToken = signToken(user.id);
        const resetLink = `${process.env.URL}/api/v1/user/-password?token=${resetToken}`;

        const mailer = new mailService();
        await mailer.sendPasswordResetEmail(email, resetLink);

        return response.success(res, "Password reset email sent successfully");
    });

    // Reset password handler
    static changePassword = asyncFun(async (req, res) => {
        try {
        
            const { token } = req.query;
            const { password } = req.body;
         
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            const hashedPassword = await bcrypt.hashPassword(password);
            await User.updateById(userId, { password: hashedPassword });

            return res.render('email/Succsseful', {
                    title: "Password Changed Successfully!",
                    message: "You can now close this page and sign in to your account."
                });
        } catch (error) {
             res.render('email/Failed', {
                title: "Password reset Failed",
                message: "The link is invalid or expired."
            });
        }
    });

    // // Change password handler
    // static changePassword = asyncFun(async (req, res) => {
    //     const { oldPassword, newPassword } = req.body;

    //     const user = await User.deleteById(req.user.id);
    //     const isMatch = await user.comparePassword(oldPassword);
    //     if (!isMatch) return response.fail(res, "Invalid credentials");

    //     const hashedPassword = await bcrypt.hashPassword(newPassword);
    //     await User.updateById(req.user.id, { password: hashedPassword });

    //     return response.success(res, "Password changed successfully");
    // });

    // Role-based access control
    static restrictTo = (...roles) => {
        return asyncFun(async (req, res, next) => {
            if (!roles.includes(req.user.role) && !(roles.includes("User") && req.user.id === req.params.id)) {
                return response.fail(res, "You do not have permission to perform this action", [], 403);
            }
            next();
        });
    };

    // Email verification check
    static verifiyUser = asyncFun((req, res, next) => {
        if (!req.user.isVerified) {
            return response.fail(res, "Please verify your email first", [], 403);
        }
        next();
    });

    // Auth check middleware
    static validateAuth = asyncFun(async (req, res, next) => {
        const token = req.headers['x-auth-token'];
        if (!token) return response.fail(res, "No token provided", [], 401);

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userData = await User.findById(decoded.userId);
            if (!userData) return response.fail(res, "User not found", [], 404);

            req.user = userData;
            next();
        } catch (error) {
            return response.fail(res, "Invalid or expired token", [], 401);
        }
    });

    // Show reset password form
    static showResetPasswordForm = asyncFun(async (req, res) => {
        const { token } = req.query;
        if (!token) {
            return res.render('email/emailVerifyFailed', { message: "Invalid or missing token." });
        }
        return res.render('email/resetPasswordForm', { token });
    });
}

module.exports = authController;
