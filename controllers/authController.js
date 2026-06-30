const User = require('../models/User');
const { createToken } = require('../config/jwt');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Handle Errors
const handleErrors = (err) => {
    let errors = { name: '', email: '', password: '' };

    // incorrect email or password
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    // duplicate error code
    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

exports.register_get = (req, res) => {
    res.render('auth/register', { title: 'Register - ProNet', layout: 'layouts/main' });
};

exports.login_get = (req, res) => {
    res.render('auth/login', { title: 'Login - ProNet', layout: 'layouts/main' });
};

exports.register_post = async (req, res) => {
    const { name, email, password, headline } = req.body;
    let profilePhoto = `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`;

    if (req.file) {
        profilePhoto = '/uploads/' + req.file.filename;
    }

    try {
        const user = await User.create({ name, email, password, headline, profilePhoto });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/login');
};

exports.forgotPassword_get = (req, res) => {
    res.render('auth/forgot-password', { title: 'Forgot Password - ProNet', layout: 'layouts/main' });
};

exports.forgotPassword_post = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ error: 'There is no user with that email' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password reset token',
                message
            });
            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            res.status(500).json({ error: 'Email could not be sent' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.resetPassword_get = async (req, res) => {
    // Just render the reset view with the token
    res.render('auth/reset-password', { 
        title: 'Reset Password - ProNet', 
        layout: 'layouts/main',
        token: req.params.token 
    });
};

exports.resetPassword_post = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
