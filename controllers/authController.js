const User = require('../models/User');
const { createToken } = require('../config/jwt');

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
