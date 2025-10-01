const nodemailer = require('nodemailer');

class mailService {

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.APP_PASS
            }
        });
    }

    // Function to send verification email
    async sendVerificationEmail(toEmail, verificationLink) {
        const mailOptions = {
            from: `"DataVanta" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'DataVanta : Email Verification',
            html: `
            <div style="font-family: Arial, sans-serif; background: #f4f6f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1); padding: 30px; text-align: center;">
                    <h2 style="color: #2563eb;">Welcome to DataVanta 🎉</h2>
                    <p style="font-size: 16px; color: #333;">
                        Please verify your email address to activate your account.
                    </p>
                    <a href="${verificationLink}" 
                       style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                       Verify Email
                    </a>
                    <p style="margin-top: 30px; font-size: 12px; color: #777;">
                        If you didn’t create a DataVanta account, you can safely ignore this email.
                    </p>
                </div>
            </div>
            `
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Verification email sent to:', toEmail);
        } catch (error) {
            console.error('Error sending verification email:', error);
        }
    }

    // Function to send password reset email
    async sendPasswordResetEmail(toEmail, resetLink) {
        const mailOptions = {
            from: `"DataVanta" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'DataVanta : Password Reset',
            html: `
            <div style="font-family: Arial, sans-serif; background: #f4f6f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1); padding: 30px; text-align: center;">
                    <h2 style="color: #dc2626;">Reset Your Password 🔒</h2>
                    <p style="font-size: 16px; color: #333;">
                        You requested to reset your password. Click the button below to proceed:
                    </p>
                    <a href="${resetLink}" 
                       style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                       Reset Password
                    </a>
                    <p style="margin-top: 30px; font-size: 12px; color: #777;">
                        If you didn’t request this, you can safely ignore this email.
                    </p>
                </div>
            </div>
            `
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Password reset email sent to:', toEmail);
        } catch (error) {
            console.error('Error sending password reset email:', error);
        }
    }
}

module.exports = mailService;
