const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let userRole = role || 'user';
        if (email === 'nawaladitya06@gmail.com') {
            userRole = 'superadmin';
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: userRole
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Auto-promote if matches email but role is wrong (migration)
            if (user.email === 'nawaladitya06@gmail.com' && user.role !== 'superadmin') {
                user.role = 'superadmin';
                await user.save();
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    const { token } = req.body;
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture } = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // Auto-promote if matches email but role is wrong (migration)
            if (user.email === 'nawaladitya06@gmail.com' && user.role !== 'superadmin') {
                user.role = 'superadmin';
                await user.save();
            }
            // User exists, log them in
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar || picture, // Use google picture if no local avatar set yet (logic optional)
                token: generateToken(user._id)
            });
        } else {
            // Create new user
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            // Note: We might want to mark this user as 'google-auth' so they can't login with password unless they set one?
            // For MERN simplicity, we just generate a random password.

            let userRole = 'user';
            if (email === 'nawaladitya06@gmail.com') {
                userRole = 'superadmin';
            }

            user = await User.create({
                name,
                email,
                password: randomPassword,
                role: userRole
                // Assuming your User model doesn't strictly enforce schema if you added strict:false, but based on view_file earlier it's strict.
                // You didn't show 'avatar' in the schema earlier, but we're trying to use it in frontend?
                // Let's assume schema matches or we just rely on standard fields. 
                // We'll update schema if needed, but 'avatar' was used in frontend logic I wrote.
                // Wait, I used localStorage for avatar in frontend logic earlier, so backend might not need to store it yet if schema doesn't have it.
                // But let's try to send it back.
            });

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({ message: `Google authentication failed: ${error.message}` });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    // We assume req.user is set by protect middleware
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.avatar = req.body.avatar || user.avatar;

        // If password is sent, update it (hashing handled by User model pre-save)
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset url
        // In production, this should be the frontend URL
        const protocol = req.protocol;
        const host = req.get('host');
        const resetUrl = process.env.NODE_ENV === 'production'
            ? `${protocol}://${host}/resetpassword/${resetToken}`
            : `http://localhost:5173/resetpassword/${resetToken}`;

        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #ff4d6d; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Sweet Delights</h1>
                </div>
                <div style="padding: 30px; color: #333;">
                    <h2>Password Reset Request</h2>
                    <p>You are receiving this email because you (or someone else) have requested the reset of a password for your account.</p>
                    <p>Please click on the button below to complete the process:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #ff4d6d; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                    <p>The link will expire in 10 minutes.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #888;">If the button doesn't work, copy and paste this link into your browser: <br>${resetUrl}</p>
                </div>
            </div>
        `;

        try {
            const sendEmail = require('../utils/sendEmail');
            await sendEmail({
                email: user.email,
                subject: 'Sweet Delights - Password Reset',
                message: message
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (error) {
            console.error('Email send error:', error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
    // Get hashed token
    const crypto = require('crypto');
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            token: generateToken(user._id), // Log them in immediately
            message: 'Password Updated Success'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    googleLogin,
    updateUserProfile,
    forgotPassword,
    resetPassword
};
